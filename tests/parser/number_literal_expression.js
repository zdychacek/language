import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors } from './utils';

test('Parser - Number literal expression', (t) => {
  const input = '5';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.equal(program.statements.length, 1, 'program has not enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const literal = stmt.expression;

  t.ok(literal instanceof ast.IntegerLiteral, 'expression is ast.IntegerLiteral');
  t.equal(literal.value, 5);
  t.equal(literal.tokenLiteral(), '5');

  t.end();
});
