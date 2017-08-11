/* eslint-disable no-use-before-define */

import * as ast from './ast';
import * as object from './object';

function evalStatements (statements) {
  let result = null;

  statements.forEach((stmt) => {
    result = evaluate(stmt);
  });

  return result;
}

export default function evaluate (node) {
  const type = node.constructor;

  switch (type) {
    // Statements
    case ast.Program:
      return evalStatements(node.statements);
    case ast.ExpressionStatement:
      return evaluate(node.expression);
    // Expressions
    case ast.NumberLiteral:
      return new object.NumberObject(node.literal);
  }

  return null;
}
