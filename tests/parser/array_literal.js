import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testInfixExpression, testNumberLiteral } from './utils';
import { is } from '../utils';

test('Parser - Array literal', (t) => {
  const input = '[ 1, 2 * 2, 3 + 3 ]';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

  t.equal(program.statements.length, 1, 'program has not enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const array = stmt.expression;

  t.ok(is(array, ast.ArrayLiteral), 'array is ast.ArrayLiteral');
  t.equal(array.elements.length, 3, 'aray has three elements');

  testNumberLiteral(t, array.elements[0], 1);
  testInfixExpression(t, array.elements[1], 2, '*', 2);
  testInfixExpression(t, array.elements[2], 3, '+', 3);

  t.end();
});
