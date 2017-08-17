import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import { testLetStatement } from './utils';

test('Parser - Let statement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/let_statement.lang'), 'utf8');

  const expected = [ 'x', 'y', 'foobar' ];

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 3, 'program.statements contains 3 statements');

  expected.forEach((value, i) => {
    if (!testLetStatement(t, program.statements[i], value)) {
      return;
    }
  });

  t.end();
});
