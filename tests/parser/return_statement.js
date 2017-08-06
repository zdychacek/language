import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { ReturnStatement } from '../../src/ast';
import { checkParserErrors } from './utils';

function testReturnStatement (t, stmt) {
  t.equal(stmt.tokenValue(), 'return', 'stmt.tokenValue is "return"');
  t.equal(stmt.constructor.name, ReturnStatement.name, 'stmt is ReturnStatement');

  return true;
}

test('Parser - ReturnStatement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/return_statement.lang'), 'utf8');

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 3, 'program.statements contains 3 statements');

  program.statements.forEach((stmt) => {
    if (!testReturnStatement(t, stmt)) {
      return;
    }
  });

  t.end();
});
