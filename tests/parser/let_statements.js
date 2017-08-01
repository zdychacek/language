import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { LetStatement } from '../../src/ast';

function testLetStatement (t, stmt, expected) {
  t.equal(stmt.tokenLiteral(), 'let', 'stmt.tokenLiteral is "let"');
  t.equal(stmt.constructor.name, LetStatement.name, 'stmt is LetStatement');
  t.equal(stmt.name.value, expected, `stmt.name.value is "${expected}"`);

  return true;
}

test('Parser - LetStatement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/let_statements.lang'), 'utf8');

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  const program = parser.parseProgram();

  t.ok(program, 'ParseProgram() is not null');
  t.equal(program.statements.length, 3, 'program.statements contains 3 statements');

  const expected = [ 'x', 'y', 'foobar' ];

  expected.forEach((value, i) => {
    const stmt = program.statements[i];

    if (!testLetStatement(t, stmt, value)) {
      return;
    }
  });

  t.end();
});
