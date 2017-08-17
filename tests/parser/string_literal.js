import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';

test('Parser - String literal expression', (t) => {
  const input = '"hello world"';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.equal(program.statements.length, 1, 'program has enough statements');

  const stmt = program.statements[0];
  const stringLiteral = stmt.expression;

  t.ok(stringLiteral instanceof ast.StringLiteral, 'program.statements[0] is ast.StringLiteral');

  t.equal(stringLiteral.literal, 'hello world', 'literal is "hello world"');

  t.end();
});
