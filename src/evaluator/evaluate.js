/* eslint-disable no-use-before-define */

import * as ast from '../parser/ast';
import * as object from './object';
import * as consts from './constants';
import builtins from './builtins';

const ObjectType = object.ObjectType;

function evalProgram (statements, env) {
  let result = null;

  for (const stmt of statements) {
    result = evaluate(stmt, env);

    if (result instanceof object.ReturnValueObject) {
      return result.value;
    }
    else if (result instanceof object.ErrorObject) {
      return result;
    }
  }

  return result;
}

function evalBlockStatement (statements, env) {
  let result = null;

  for (const stmt of statements) {
    result = evaluate(stmt, env);

    if (
      result instanceof object.ReturnValueObject ||
      result instanceof object.ErrorObject
    ) {
      return result;
    }
  }

  return result;
}

function nativeBoolToBooleanObject (value) {
  if (value) {
    return consts.TRUE;
  }

  return consts.FALSE;
}

function evalPrefixExpression (operator, right) {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return new object.ErrorObject(`Unknown operator: ${operator}${right.getType()}.`);
  }
}

function evalBangOperatorExpression (right) {
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

function evalMinusPrefixOperatorExpression (right) {
  if (right.getType() !== ObjectType.NUMBER_OBJ) {
    return new object.ErrorObject(`Unknown operator: -${right.getType()}.`);
  }

  return new object.NumberObject(-right.value);
}

function evalNumberInfixExpression (operator, left, right) {
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
      return nativeBoolToBooleanObject(leftValue < rightValue);
    case '>':
      return nativeBoolToBooleanObject(leftValue > rightValue);
    case '==':
      return nativeBoolToBooleanObject(leftValue === rightValue);
    case '!=':
      return nativeBoolToBooleanObject(leftValue !== rightValue);
    default:
      return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
  }
}

function evalStringInfixExpression (operator, left, right) {
  if (operator !== '+') {
    return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
  }

  return new object.StringObject(left.value + right.value);
}

function evalInfixExpression (operator, left, right) {
  if (left.getType() === ObjectType.NUMBER_OBJ && right.getType() === ObjectType.NUMBER_OBJ) {
    return evalNumberInfixExpression(operator, left, right);
  }

  if (operator === '==') {
    return nativeBoolToBooleanObject(left === right);
  }
  else if (operator === '!=') {
    return nativeBoolToBooleanObject(left !== right);
  }
  else if (left.getType() !== right.getType()) {
    return new object.ErrorObject(`Type mismatch: ${left.getType()} ${operator} ${right.getType()}.`);
  }
  else if (left.getType() === ObjectType.STRING_OBJ && right.getType() === ObjectType.STRING_OBJ) {
    return evalStringInfixExpression(operator, left, right);
  }

  return new object.ErrorObject(`Unknown operator: ${left.getType()} ${operator} ${right.getType()}.`);
}

function isTruthy (obj) {
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

function evalIfExpression (node, env) {
  const condition = evaluate(node.condition, env);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(node.consequence, env);
  }
  else if (node.alternative) {
    return evaluate(node.alternative, env);
  }
  else {
    return consts.NULL;
  }
}

function evalIdentifier (node, env) {
  const value = env.get(node.value);

  if (value) {
    return value;
  }

  const builtin = builtins[node.value];

  if (builtin) {
    return builtin;
  }

  if (!value) {
    return new object.ErrorObject(`Identifier not found: ${node.value}.`);
  }

  return value;
}

function evalExpressions (exps, env) {
  const result = [];

  for (const exp of exps) {
    const evaluated = evaluate(exp, env);

    if (isError(evaluated)) {
      return [ evaluated ];
    }

    result.push(evaluated);
  }

  return result;
}

function extendFunctionEnv (fn, args) {
  const env = fn.env.extend();

  fn.parameters.forEach((param, index) => {
    env.set(param.value, args[index]);
  });

  return env;
}

function unwrapReturnValue (obj) {
  if (obj instanceof object.ReturnValueObject) {
    return obj.value;
  }

  return obj;
}

function applyFunction (fn, args) {
  if (fn instanceof object.FunctionObject) {
    const extendedEnv = extendFunctionEnv(fn, args);
    const evaluated = evaluate(fn.body, extendedEnv);

    return unwrapReturnValue(evaluated);
  }
  else if (fn instanceof object.BuiltinObject) {
    return fn.value(...args);
  }
  else {
    return new object.ErrorObject(`Not a function: ${fn.getType()}.`);
  }
}

function isError (obj) {
  return obj instanceof object.ErrorObject;
}

export default function evaluate (node, env) {
  const type = node.constructor;

  switch (type) {
    // Statements
    case ast.Program:
      return evalProgram(node.statements, env);
    case ast.ExpressionStatement:
      return evaluate(node.expression, env);
    case ast.ReturnStatement: {
      let value = consts.VOID;

      if (isError(value)) {
        return value;
      }

      if (node.returnValue) {
        value = evaluate(node.returnValue, env);
      }

      return new object.ReturnValueObject(value);
    }
    case ast.BlockStatement:
      return evalBlockStatement(node.statements, env);
    case ast.LetStatement: {
      const value = evaluate(node.expression, env);

      if (isError(value)) {
        return value;
      }

      env.set(node.name.value, value);
    }
    // Expressions
    case ast.NumberLiteral:
      return new object.NumberObject(node.literal);
    case ast.StringLiteral:
      return new object.StringObject(node.literal);
    case ast.NullLiteral:
      return new object.NullObject();
    case ast.BooleanLiteral:
      return nativeBoolToBooleanObject(node.literal);
    case ast.PrefixExpression: {
      const right = evaluate(node.right, env);

      if (isError(right)) {
        return right;
      }

      return evalPrefixExpression(node.operator, right);
    }
    case ast.InfixExpression: {
      const left = evaluate(node.left, env);

      if (isError(left)) {
        return left;
      }

      const right = evaluate(node.right, env);

      if (isError(right)) {
        return right;
      }

      return evalInfixExpression(node.operator, left, right);
    }
    case ast.IfExpression:
      return evalIfExpression(node, env);
    case ast.Identifier:
      return evalIdentifier(node, env);
    case ast.FunctionLiteral: {
      const params = node.parameters;
      const body = node.body;

      return new object.FunctionObject(params, body, env);
    }
    case ast.CallExpression: {
      const fn = evaluate(node.fn, env);

      if (isError(fn)) {
        return fn;
      }

      const args = evalExpressions(node.arguments, env);

      if (args.length === 1 && isError(args[0])) {
        return args[0];
      }

      return applyFunction(fn, args);
    }
    case ast.SequenceExpression: {
      const exps = evalExpressions(node.expressions, env);

      if (exps.length === 1 && isError(exps[0])) {
        return exps[0];
      }

      return exps[exps.length - 1];
    }
    case ast.AssignmentExpression: {
      const bindingName = node.left.value;

      if (!env.get(bindingName)) {
        return new object.ErrorObject(`Cannot assign to undeclared identifier: "${bindingName}".`);
      }

      const right = evaluate(node.right, env);

      if (isError(right)) {
        return right;
      }

      env.set(bindingName, right);

      return right;
    }
  }

  return null;
}
