import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import {
  checkParserErrors,
  testLiteralExpression,
  testIdentifier,
  testInfixExpression,
} from './utils';

test('Parser - Call expression', (t) => {
  const input = 'add(1, 2 * 3, 4 + 5);';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.equal(program.statements.length, 1, 'program contains 1 statement');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const { expression } = stmt;

  t.ok(expression instanceof ast.CallExpression, 'stmt.expression is ast.CallExpression');

  testIdentifier(t, expression.fn, 'add');

  t.equal(expression.arguments.length, 3, 'stmt.expression has right arguments count');

  testLiteralExpression(t, expression.arguments[0], 1);
  testInfixExpression(t, expression.arguments[1], 2, '*', 3);
  testInfixExpression(t, expression.arguments[2], 4, '+', 5);

  t.end();
});
