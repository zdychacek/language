/* eslint-disable no-use-before-define */

import fs from 'fs';
import path from 'path';
import * as ast from '../parser/ast';
import * as object from './object';
import * as consts from './constants';
import builtins from './builtins';
import Environment from './environment';
import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';

const ObjectType = object.ObjectType;

class Evaluator {
  // file name we are evaluating
  _fileName = '';
  // contains error object if any occured while importing modules
  _moduleImportError = null;
  // evaluator internal state
  _state = {};

  evaluate (node, env) {
    const type = node.constructor;

    switch (type) {
      // Statements
      case ast.Program:
        // save file name
        this._fileName = node.fileName;

        return this.evalProgram(node.statements, env);
      case ast.ExpressionStatement:
        return this.evaluate(node.expression, env);
      case ast.ReturnStatement: {
        let value = consts.VOID;

        if (this.isError(value)) {
          return value;
        }

        if (node.returnValue) {
          value = this.evaluate(node.returnValue, env);
        }

        return new object.ReturnValueObject(value);
      }
      case ast.BlockStatement:
        return this.evalBlockStatement(node.statements, env);
      case ast.LetStatement: {
        const value = this.evaluate(node.expression, env);

        if (this.isError(value)) {
          return value;
        }

        env.assign(node.name.value, value);

        return value;
      }
      case ast.ImportStatement: {
        const result = this.evalImportStatement(node, env);

        if (this._moduleImportError) {
          return this._moduleImportError;
        }

        return result;
      }
      // Expressions
      case ast.NumberLiteral:
        return new object.NumberObject(node.literal);
      case ast.StringLiteral:
        return new object.StringObject(node.literal);
      case ast.NullLiteral:
        return new object.NullObject();
      case ast.BooleanLiteral:
        return this.nativeBoolToBooleanObject(node.literal);
      case ast.ObjectLiteral:
        return this.evalObjectLiteral(node, env);
      case ast.PrefixExpression: {
        const right = this.evaluate(node.right, env);

        if (this.isError(right)) {
          return right;
        }

        return this.evalPrefixExpression(node.operator, right);
      }
      case ast.InfixExpression: {
        if ([ '&&', '||' ].includes(node.operator)) {
          return this.evalLogicalExpression(node, env);
        }

        const left = this.evaluate(node.left, env);

        if (this.isError(left)) {
          return left;
        }

        const right = this.evaluate(node.right, env);

        if (this.isError(right)) {
          return right;
        }

        return this.evalInfixExpression(node.operator, left, right);
      }
      case ast.IfExpression:
        return this.evalIfExpression(node, env);
      case ast.Identifier:
        return this.evalIdentifier(node, env);
      case ast.FunctionLiteral: {
        return new object.FunctionObject(node.parameters, node.body, env);
      }
      case ast.CallExpression: {
        const fn = this.evaluate(node.fn, env);

        if (this.isError(fn)) {
          return fn;
        }

        const args = this.evalExpressions(node.arguments, env);

        if (args.length === 1 && this.isError(args[0])) {
          return args[0];
        }

        return this.applyFunction(fn, args);
      }
      case ast.SequenceExpression: {
        const exps = this.evalExpressions(node.expressions, env);

        if (exps.length === 1 && this.isError(exps[0])) {
          return exps[0];
        }

        return exps[exps.length - 1];
      }
      case ast.AssignmentExpression: {
        if (node.left instanceof ast.MemberExpression) {
          return this.evalMemberExpressionAssignment(node, env);
        }
        else {
          return this.evalExpressionAssignment(node, env);
        }
      }
      case ast.ArrayLiteral: {
        const elements = this.evalExpressions(node.elements, env);

        if (elements.length === 1 && this.isError(elements[0])) {
          return elements[0];
        }

        return new object.ArrayObject(elements);
      }
      case ast.MemberExpression: {
        const left = this.evaluate(node.left, env);

        if (this.isError(left)) {
          return left;
        }

        let index = null;

        if (node.computed) {
          index = this.evaluate(node.index, env);

          if (this.isError(index)) {
            return index;
          }
        }
        else {
          index = new object.StringObject(node.index.value);
        }

        return this.evalMemberExpression(left, index);
      }
    }

    return null;
  }

  evalProgram (statements, env) {
    let result = null;

    for (const stmt of statements) {
      result = this.evaluate(stmt, env);

      if (result instanceof object.ReturnValueObject) {
        return result.value;
      }
      else if (result instanceof object.ErrorObject) {
        return result;
      }
    }

    return result;
  }

  evalBlockStatement (statements, env) {
    let result = null;

    env = env.extend();

    for (const stmt of statements) {
      result = this.evaluate(stmt, env);

      if (
        result instanceof object.ReturnValueObject ||
        result instanceof object.ErrorObject
      ) {
        return result;
      }
    }

    return result;
  }

  nativeBoolToBooleanObject (value) {
    if (value) {
      return consts.TRUE;
    }

    return consts.FALSE;
  }

  evalPrefixExpression (operator, right) {
    switch (operator) {
      case '!':
        return this.evalBangOperatorExpression(right);
      case '-':
        return this.evalMinusPrefixOperatorExpression(right);
      default:
        return new object.ErrorObject(`Unknown operator: ${operator}${right.getType()}.`);
    }
  }

  evalBangOperatorExpression (right) {
    switch (right) {
      case consts.TRUE:
        return consts.FALSE;
      case consts.FALSE:
        return consts.TRUE;
      case consts.NULL:
        return consts.TRUE;
      default:
        return consts.FALSE;
    }
  }

  evalMinusPrefixOperatorExpression (right) {
    if (right.getType() !== ObjectType.NUMBER_OBJ) {
      return new object.ErrorObject(`Unknown operator: -${right.getType()}.`);
    }

    return new object.NumberObject(-right.value);
  }

  evalNumberInfixExpression (operator, left, right) {
    const leftValue = left.value;
    const rightValue = right.value;

    switch (operator) {
      case '+':
        return new object.NumberObject(leftValue + rightValue);
      case '-':
        return new object.NumberObject(leftValue - rightValue);
      case '*':
        return new object.NumberObject(leftValue * rightValue);
      case '/':
        return new object.NumberObject(leftValue / rightValue);
      case '<':
        return this.nativeBoolToBooleanObject(leftValue < rightValue);
      case '>':
        return this.nativeBoolToBooleanObject(leftValue > rightValue);
      case '==':
        return this.nativeBoolToBooleanObject(leftValue === rightValue);
      case '!=':
        return this.nativeBoolToBooleanObject(leftValue !== rightValue);
      default:
        return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
    }
  }

  evalStringInfixExpression (operator, left, right) {
    switch (operator) {
      case '+':
        return new object.StringObject(left.value + right.value);
      case '==':
        return new object.BooleanObject(left.value === right.value);
      case '!=':
        return new object.BooleanObject(left.value !== right.value);
      default:
        return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
    }
  }

  evalInfixExpression (operator, left, right) {
    if (left.getType() === ObjectType.NUMBER_OBJ && right.getType() === ObjectType.NUMBER_OBJ) {
      return this.evalNumberInfixExpression(operator, left, right);
    }

    if (left.getType() === ObjectType.STRING_OBJ && right.getType() === ObjectType.STRING_OBJ) {
      return this.evalStringInfixExpression(operator, left, right);
    }

    if (operator === '==') {
      return this.nativeBoolToBooleanObject(left === right);
    }

    if (operator === '!=') {
      return this.nativeBoolToBooleanObject(left !== right);
    }

    if (left.getType() !== right.getType()) {
      return new object.ErrorObject(`Type mismatch: ${left.getType()} ${operator} ${right.getType()}.`);
    }

    return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
  }

  evalLogicalExpression (node, env) {
    const left = this.evaluate(node.left, env);
    const { operator } = node;

    if (this.isError(left)) {
      return left;
    }

    if (left.getType() !== ObjectType.BOOLEAN_OBJ) {
      return new object.ErrorObject(`Operator ${operator} can be used only with ${ObjectType.BOOLEAN_OBJ}, got ${left.getType()} instead.`);
    }

    // lazy evaluation
    if (left === consts.FALSE && operator === '&&') {
      return consts.FALSE;
    }

    if (left === consts.TRUE && operator === '||') {
      return consts.TRUE;
    }

    const right = this.evaluate(node.right, env);

    if (this.isError(right)) {
      return right;
    }

    if (right.getType() !== ObjectType.BOOLEAN_OBJ) {
      return new object.ErrorObject(`Operator ${operator} can be used only with ${ObjectType.BOOLEAN_OBJ}, got ${right.getType()} instead.`);
    }

    switch (operator) {
      case '&&':
        return this.nativeBoolToBooleanObject(left.value && right.value);
      case '||':
        return this.nativeBoolToBooleanObject(left.value || right.value);
      default:
        return new object.ErrorObject(`Unsupported ${operator}.`);
    }
  }

  isTruthy (obj) {
    switch (obj) {
      case consts.NULL:
        return false;
      case consts.TRUE:
        return true;
      case consts.FALSE:
        return false;
      default:
        return true;
    }
  }

  evalIfExpression (node, env) {
    const condition = this.evaluate(node.condition, env);

    if (this.isError(condition)) {
      return condition;
    }

    if (this.isTruthy(condition)) {
      return this.evaluate(node.consequence, env);
    }
    else if (node.alternative) {
      return this.evaluate(node.alternative, env);
    }
    else {
      return consts.NULL;
    }
  }

  evalIdentifier (node, env) {
    const value = env.get(node.value);

    if (value) {
      return value;
    }

    const builtin = builtins[node.value];

    if (builtin) {
      return builtin;
    }

    if (!value) {
      return new object.ErrorObject(`Identifier not found: "${node.value}".`);
    }

    return value;
  }

  evalExpressions (exps, env) {
    const result = [];

    for (const exp of exps) {
      const evaluated = this.evaluate(exp, env);

      if (this.isError(evaluated)) {
        return [ evaluated ];
      }

      result.push(evaluated);
    }

    return result;
  }

  extendFunctionEnv (fn, args) {
    const env = fn.env.extend();

    fn.parameters.forEach((param, index) => {
      env.assign(param.value, args[index]);
    });

    return env;
  }

  unwrapReturnValue (obj) {
    if (obj instanceof object.ReturnValueObject) {
      return obj.value;
    }

    return obj;
  }

  applyFunction (fn, args) {
    if (fn instanceof object.FunctionObject) {
      const extendedEnv = this.extendFunctionEnv(fn, args);
      const evaluated = this.evaluate(fn.body, extendedEnv);

      return this.unwrapReturnValue(evaluated);
    }
    else if (fn instanceof object.BuiltinObject) {
      return fn.value(...args);
    }
    else {
      return new object.ErrorObject(`Not a function: ${fn.getType()}.`);
    }
  }

  isError (obj) {
    return obj instanceof object.ErrorObject;
  }

  evalArrayOrStringMemberExpression (arrayOrString, index) {
    const idx = index.value;
    let max = null;

    if (arrayOrString.getType() === ObjectType.ARRAY_OBJ) {
      max = arrayOrString.elements.length - 1;
    }

    if (arrayOrString.getType() === ObjectType.STRING_OBJ) {
      max = arrayOrString.value.length - 1;
    }

    if (idx < 0 || idx > max) {
      return consts.NULL;
    }

    if (arrayOrString.getType() === ObjectType.ARRAY_OBJ) {
      return arrayOrString.elements[idx];
    }

    if (arrayOrString.getType() === ObjectType.STRING_OBJ) {
      return new object.StringObject(arrayOrString.value[idx]);
    }
  }

  evalObjectMemberExpression (obj, index) {
    if (!index.getHashKey) {
      return new object.ErrorObject(`Unusable as object key: ${index.getType()}.`);
    }

    const pair = obj.pairs.get(index.getHashKey());

    if (!pair) {
      return consts.NULL;
    }

    return pair.value;
  }

  evalMemberExpression (left, index) {
    if (
      (left.getType() === ObjectType.ARRAY_OBJ || left.getType() === ObjectType.STRING_OBJ) &&
      index.getType() === ObjectType.NUMBER_OBJ
    ) {
      return this.evalArrayOrStringMemberExpression(left, index);
    }
    else if (left.getType() === ObjectType.OBJECT_OBJ) {
      return this.evalObjectMemberExpression(left, index);
    }

    return new object.ErrorObject(`Index operator not supported: ${left.getType()}.`);
  }

  evalImportStatement (node, env) {
    // TODO: implement parser check if `node.source` has some length
    const sourceFilePath = path.join(path.dirname(this._fileName), node.source.literal);

    let fileContent = '';

    try {
      fileContent = fs.readFileSync(sourceFilePath, 'utf8');
    }
    catch (_) {
      return new object.ErrorObject(`Error while importing "${sourceFilePath}" file.`);
    }

    const moduleEnv = new Environment();

    try {
      const lexer = new Lexer(fileContent, sourceFilePath);
      const parser = new Parser(lexer);

      this.evaluate(parser.parseProgram(), moduleEnv);
    }
    catch (ex) {
      return this._moduleImportError = new object.ErrorObject(ex.message);
    }

    const moduleBindings = moduleEnv.getAllBindings();

    if (node.alias) {
      const pairs = new Map();

      Object.entries(moduleBindings).forEach(([ name, value ]) => {
        const key = new object.StringObject(name);

        pairs.set(key.getHashKey(), { key, value });
      });

      // merge module environment with current one under the alias
      env.assign(node.alias, new object.ObjectObject(pairs));
    }
    else {
      // merge module environment with current one
      Object.entries(moduleBindings)
        .forEach(([ name, value ]) => env.assign(name, value));
    }

    return new object.ModuleObject(sourceFilePath, moduleBindings);
  }

  evalObjectLiteral (node, env) {
    const pairs = new Map();

    for (const [ keyNode, { value: valueNode, computed } ] of node.pairs) {
      const key = computed ?
        this.evaluate(keyNode, env) :
        new object.StringObject(keyNode.literal || keyNode.value);

      if (this.isError(key)) {
        return key;
      }

      if (!key.getHashKey) {
        return new object.ErrorObject(`Unusable as object key: ${key.getType()}.`);
      }

      const value = this.evaluate(valueNode, env);

      if (this.isError(value)) {
        return value;
      }

      pairs.set(key.getHashKey(), { key, value });
    }

    return new object.ObjectObject(pairs);
  }

  evalExpressionAssignment (node, env) {
    const bindingName = node.left.value;

    if (!env.get(bindingName)) {
      return new object.ErrorObject(`Cannot assign to undeclared identifier: "${bindingName}".`);
    }

    const right = this.evaluate(node.right, env);

    if (this.isError(right)) {
      return right;
    }

    if (!env.set(bindingName, right)) {
      return new object.ErrorObject(`Cannot assign to undeclared identifier: "${bindingName}".`);
    }

    return right;
  }

  evalMemberExpressionAssignment (node, env) {
    const memberExpression = node.left;
    const obj = this.evaluate(memberExpression.left, env);

    if (this.isError(obj)) {
      return obj;
    }

    let index = null;

    if (memberExpression.computed) {
      index = this.evaluate(memberExpression.index, env);
    }
    else {
      index = new object.StringObject(memberExpression.index.value);
    }

    if (this.isError(index)) {
      return index;
    }

    if (!index.getHashKey) {
      return new object.ErrorObject(`Unusable as object key: ${index.getType()}.`);
    }

    const value = this.evaluate(node.right, env);

    if (this.isError(value)) {
      return value;
    }

    const pair = obj.pairs.get(index.getHashKey());

    // if pair exists, update it
    if (pair) {
      pair.value = value;
    }
    // ... pair does not exist, so create new
    else {
      obj.pairs.set(index.getHashKey(), { key: index, value });
    }

    return obj;
  }
}

export default function (program, env) {
  const evaluator = new Evaluator();

  return evaluator.evaluate(program, env);
}
