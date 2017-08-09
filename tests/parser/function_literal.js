import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors, testLiteralExpression, testInfixExpression } from './utils';

test('Parser - Function literal', (t) => {
  const input = 'fn(x, y,) { x + y; };';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.equal(program.statements.length, 1, 'program has not enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const fn = stmt.expression;

  t.ok(fn instanceof ast.FunctionLiteral, 'fn is ast.FunctionLiteral');
  t.equal(fn.parameters.length, 2, 'fuction has two parameters');

  testLiteralExpression(t, fn.parameters[0], 'x');
  testLiteralExpression(t, fn.parameters[1], 'y');

  t.equal(fn.body.statements.length, 1, 'function body has one statement');

  const bodyStmt = fn.body.statements[0];

  t.ok(bodyStmt instanceof ast.ExpressionStatement, 'function body statement is not ast.ExpressionStatement');

  testInfixExpression(t, bodyStmt.expression, 'x', '+', 'y');

  t.end();
});
