import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { LetStatement } from '../../src/ast';
import { checkParserErrors } from './utils';

function testLetStatement (t, stmt, expected) {
  t.equal(stmt.tokenLiteral(), 'let', 'stmt.tokenLiteral is "let"');
  t.equal(stmt.constructor.name, LetStatement.name, 'stmt is LetStatement');
  t.equal(stmt.name.value, expected, `stmt.name.value is "${expected}"`);

  return true;
}

test('Parser - LetStatement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/let_statement.lang'), 'utf8');

  const expected = [ 'x', 'y', 'foobar' ];

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 3, 'program.statements contains 3 statements');

  expected.forEach((value, i) => {
    if (!testLetStatement(t, program.statements[i], value)) {
      return;
    }
  });

  t.end();
});
