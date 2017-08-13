/* eslint-disable no-use-before-define */

import * as ast from './ast';
import * as object from './object';

const ObjectType = object.ObjectType;

const TRUE = new object.BooleanObject(true);
const FALSE = new object.BooleanObject(false);
const NULL = new object.NullObject();
const VOID = new object.VoidObject();

function evalProgram (statements) {
  let result = null;

  for (const stmt of statements) {
    result = evaluate(stmt);

    if (result instanceof object.ReturnValueObject) {
      return result.value;
    }
    else if (result instanceof object.ErrorObject) {
      return result;
    }
  }

  return result;
}

function evalBlockStatement (statements) {
  let result = null;

  for (const stmt of statements) {
    result = evaluate(stmt);

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
    return TRUE;
  }

  return FALSE;
}

function evalPrefixExpression (operator, right) {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError(`unknown operator: ${operator}${right.getType()}`);
  }
}

function evalBangOperatorExpression (right) {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression (right) {
  if (right.getType() !== ObjectType.NUMBER_OBJ) {
    return newError(`unknown operator: -${right.getType()}`);
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
      return newError(`unknown operator: ${left.getType()} ${operator} ${right.getType()}`);
  }
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
    return newError(`type mismatch: ${left.getType()} ${operator} ${right.getType()}`);
  }

  return newError(`unknown operator: ${left.getType()} ${operator} ${right.getType()}`);
}

function isTruthy (obj) {
  switch (obj) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function evalIfExpression (node) {
  const condition = evaluate(node.condition);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(node.consequence);
  }
  else if (node.alternative) {
    return evaluate(node.alternative);
  }
  else {
    return NULL;
  }
}

function newError (message) {
  return new object.ErrorObject(message);
}

function isError (obj) {
  return obj instanceof object.ErrorObject;
}

export default function evaluate (node) {
  const type = node.constructor;

  switch (type) {
    // Statements
    case ast.Program:
      return evalProgram(node.statements);
    case ast.ExpressionStatement:
      return evaluate(node.expression);
    case ast.ReturnStatement: {
      let value = null;

      if (isError(value)) {
        return value;
      }

      if (node.returnValue === undefined) {
        value = VOID;
      }
      else {
        value = evaluate(node.returnValue);
      }

      return new object.ReturnValueObject(value);
    }
    // Expressions
    case ast.NumberLiteral:
      return new object.NumberObject(node.literal);
    case ast.BooleanLiteral:
      return nativeBoolToBooleanObject(node.literal);
    case ast.PrefixExpression: {
      const right = evaluate(node.right);

      if (isError(right)) {
        return right;
      }

      return evalPrefixExpression(node.operator, right);
    }
    case ast.InfixExpression: {
      const left = evaluate(node.left);

      if (isError(left)) {
        return left;
      }

      const right = evaluate(node.right);

      if (isError(right)) {
        return right;
      }

      return evalInfixExpression(node.operator, left, right);
    }
    case ast.BlockStatement:
      return evalBlockStatement(node.statements);
    case ast.IfExpression:
      return evalIfExpression(node);
  }

  return null;
}
