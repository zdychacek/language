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
  // evaluator internal state
  _state = {};

  evaluate (node, env) {
    const type = node.constructor;

    switch (type) {
      // Statements
      case ast.Program:
        return this.evalProgram(node, env);
      case ast.BlockStatement:
        // create new scope
        env = env.extend();

        return this.evalBlockStatement(node.statements, env);
      case ast.ExpressionStatement:
        return this.evaluate(node.expression, env);
      case ast.ReturnStatement:
        return this.evalReturnStatement(node, env);
      case ast.LetStatement:
        return this.evalLetStatement(node, env);
      case ast.ImportStatement:
        return this.evalImportStatement(node, env);
      case ast.ExportStatement:
        return this.evalExportStatement(node, env);
      case ast.ForStatement:
        return this.evalForStatement(node, env);
      case ast.BreakStatement:
        return new object.BreakObject();
      case ast.ContinueStatement:
        return new object.ContinueObject();
      // Expressions
      case ast.Identifier:
        return this.evalIdentifier(node, env);
      case ast.PrefixExpression:
        return this.evalPrefixExpression(node, env);
      case ast.InfixExpression:
        return this.evalInfixExpression(node, env);
      case ast.IfExpression:
        return this.evalIfExpression(node, env);
      case ast.CallExpression:
        return this.evalCallExpression(node, env);
      case ast.SequenceExpression:
        return this.evalSequenceExpression(node, env);
      case ast.AssignmentExpression:
        return this.evalAssignmentExpression(node, env);
      case ast.MemberExpression:
        return this.evalMemberExpression(node, env);
      // Literals
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
      case ast.ArrayLiteral:
        return this.evalArrayLiteral(node, env);
      case ast.FunctionLiteral:
        return new object.FunctionObject(node.parameters, node.body, env);
    }

    return null;
  }

  evalProgram (node, env) {
    let result = null;

    // save file name
    this._fileName = node.fileName;

    for (const stmt of node.statements) {
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

    for (const stmt of statements) {
      result = this.evaluate(stmt, env);

      if (
        result instanceof object.ReturnValueObject ||
        result instanceof object.ErrorObject ||
        result instanceof object.BreakObject ||
        result instanceof object.ContinueObject
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

  evalPrefixExpression (node, env) {
    const right = this.evaluate(node.right, env);

    if (this.isError(right)) {
      return right;
    }

    switch (node.operator) {
      case '!':
        return this.evalBangOperatorExpression(right);
      case '-':
        return this.evalMinusPrefixOperatorExpression(right);
      default:
        return new object.ErrorObject(`Unknown operator: ${node.operator}${right.getType()}.`);
    }
  }

  evalInfixExpression (node, env) {
    if ([ '&&', '||' ].includes(node.operator)) {
      return this.evalLogicalExpression(node, env);
    }

    return this.evalBinaryExpression(node, env);
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

  evalBinaryExpression (node, env) {
    const left = this.evaluate(node.left, env);

    if (this.isError(left)) {
      return left;
    }

    const right = this.evaluate(node.right, env);

    if (this.isError(right)) {
      return right;
    }

    const { operator } = node;

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

  evalCallExpression (node, env) {
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

  evalSequenceExpression (node, env) {
    const exps = this.evalExpressions(node.expressions, env);

    if (exps.length === 1 && this.isError(exps[0])) {
      return exps[0];
    }

    return exps[exps.length - 1];
  }

  evalAssignmentExpression (node, env) {
    if (node.left instanceof ast.MemberExpression) {
      return this.evalMemberExpressionAssignment(node, env);
    }
    else {
      return this.evalExpressionAssignment(node, env);
    }
  }

  evalArrayLiteral (node, env) {
    const elements = this.evalExpressions(node.elements, env);

    if (elements.length === 1 && this.isError(elements[0])) {
      return elements[0];
    }

    return new object.ArrayObject(elements);
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
    if (fn.getType() === ObjectType.EXPORT_OBJ) {
      fn = fn.value;
    }

    if (fn.getType() === ObjectType.FUNCTION_OBJ) {
      const extendedEnv = this.extendFunctionEnv(fn, args);
      let evaluated = null;

      if (fn.body instanceof ast.BlockStatement) {
        // call `evalBlockStatement` with extended env directly
        evaluated = this.evalBlockStatement(fn.body.statements, extendedEnv);
      }
      else {
        evaluated = this.evaluate(fn.body, extendedEnv);
      }

      return this.unwrapReturnValue(evaluated);
    }
    else if (fn.getType() === ObjectType.BUILTIN_OBJ) {
      return fn.value(...args);
    }

    return new object.ErrorObject(`Not a function: ${fn.getType()}.`);
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

    const property = obj.properties.get(index.getHashKey());

    if (!property) {
      return consts.NULL;
    }

    return property.value;
  }

  evalMemberExpression (node, env) {
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

  evalExportStatement (node, env) {
    const value = this.evaluate(node.value, env);

    if (this.isError(value)) {
      return value;
    }

    if (node.alias) {
      env.assign(node.alias.value, new object.ExportObject(value));
    }
    else if (node.value instanceof ast.LetStatement) {
      env.assign(node.value.name.value, new object.ExportObject(value));
    }
    else if (node.value instanceof ast.Identifier) {
      env.assign(node.value.value, new object.ExportObject(value));
    }

    return value;
  }

  evalImportStatement (node, env) {
    // if the file extension is missing, attach "lang"
    const moduleName =
      path.extname(node.source.literal) ? node.source.literal : `${node.source.literal}.lang`;

    const sourceFilePath = path.join(path.dirname(this._fileName), moduleName);

    let fileContent = '';

    try {
      fileContent = fs.readFileSync(sourceFilePath, 'utf8');
    }
    catch (ex) {
      return new object.ErrorObject(`Error while importing "${sourceFilePath}" file.`);
    }

    const moduleEnv = new Environment();

    try {
      const lexer = new Lexer(fileContent, sourceFilePath);
      const parser = new Parser(lexer);

      const result = this.evaluate(parser.parseProgram(), moduleEnv);

      if (this.isError(result)) {
        return result;
      }
    }
    catch (ex) {
      return new object.ErrorObject(ex.message);
    }

    const moduleBindings = moduleEnv.getAllBindings();

    if (node.alias) {
      const properties = new Map();

      Object.entries(moduleBindings)
        .filter(([ , value ]) => value.getType() === ObjectType.EXPORT_OBJ)
        .map(([ name, value ]) => [ name, value.value ])
        .forEach(([ name, value ]) => {
          const key = new object.StringObject(name);

          properties.set(key.getHashKey(), { key, value });
        });

      // merge module environment with current one under the alias
      env.assign(node.alias, new object.ObjectObject(properties));
    }
    else {
      // merge module environment with current one
      Object.entries(moduleBindings)
        .filter(([ , value ]) => value.getType() === ObjectType.EXPORT_OBJ)
        .map(([ name, value ]) => [ name, value.value ])
        .forEach(([ name, value ]) => env.assign(name, value));
    }

    return new object.ModuleObject(sourceFilePath, moduleBindings);
  }

  evalLetStatement (node, env) {
    const value = this.evaluate(node.expression, env);

    if (this.isError(value)) {
      return value;
    }

    env.assign(node.name.value, value);

    return value;
  }

  evalReturnStatement (node, env) {
    let value = consts.VOID;

    if (this.isError(value)) {
      return value;
    }

    if (node.returnValue) {
      value = this.evaluate(node.returnValue, env);
    }

    return new object.ReturnValueObject(value);
  }

  evalObjectLiteral (node, env) {
    const properties = new Map();

    for (const [ keyNode, { value: valueNode, computed } ] of node.properties) {
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

      properties.set(key.getHashKey(), { key, value });
    }

    return new object.ObjectObject(properties);
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

  evalObjectMemberExpressionAssignment (node, env) {
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

    const property = obj.properties.get(index.getHashKey());

    // if property exists, update it
    if (property) {
      property.value = value;
    }
    // ... property does not exist, so create new
    else {
      obj.properties.set(index.getHashKey(), { key: index, value });
    }

    return value;
  }

  evalArrayMemberExpressionAssignment (node, env) {
    const memberExpression = node.left;
    const array = this.evaluate(memberExpression.left, env);

    if (this.isError(array)) {
      return array;
    }

    const index = this.evaluate(memberExpression.index, env);

    if (this.isError(index)) {
      return index;
    }

    if (index.getType() !== ObjectType.NUMBER_OBJ) {
      return new object.ErrorObject(`Index expression must evaluate to ${ObjectType.NUMBER_OBJ}, got ${index.getType()} instead.`);
    }

    const idx = index.value;
    const max = array.elements.length - 1;

    if (idx < 0 || idx > max) {
      return new object.ErrorObject(`Index expression must evaluate to value in range <0,${max}>.`);
    }

    const value = this.evaluate(node.right, env);

    if (this.isError(value)) {
      return value;
    }

    // update value at specified index
    array.elements[idx] = value;

    return value;
  }

  evalMemberExpressionAssignment (node, env) {
    const left = this.evaluate(node.left.left, env);

    if (this.isError(left)) {
      return left;
    }

    if (left instanceof object.ObjectObject) {
      return this.evalObjectMemberExpressionAssignment(node, env);
    }
    else if (left instanceof object.ArrayObject) {
      return this.evalArrayMemberExpressionAssignment(node, env);
    }

    return new object.ErrorObject(`Index operator not supported: ${left.getType()}.`);
  }

  evalForStatement (node, env) {
    const { condition, body } = node;

    let result = null;

    while (this.evaluate(condition, env) === consts.TRUE) {
      result = this.evalBlockStatement(body.statements, env);

      if (result instanceof object.BreakObject) {
        break;
      }

      if (result instanceof object.ContinueObject) {
        continue;
      }

      if (
        result instanceof object.ReturnValueObject ||
        result instanceof object.ErrorObject
      ) {
        return result;
      }
    }

    return result;
  }
}

export default function (program, env) {
  const evaluator = new Evaluator();

  return evaluator.evaluate(program, env);
}
