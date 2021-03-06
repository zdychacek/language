import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import { ReturnStatement } from '../../src/parser/ast';

function testReturnStatement (t, stmt) {
  t.equal(stmt.getTokenValue(), 'return', 'stmt.getTokenValue is "return"');
  t.equal(stmt.constructor.name, ReturnStatement.name, 'stmt is ReturnStatement');

  return true;
}

test('Parser - Return statement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/return_statement.lang'), 'utf8');

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');

  program.statements.forEach((stmt) => {
    if (!testReturnStatement(t, stmt)) {
      return;
    }
  });

  t.end();
});
