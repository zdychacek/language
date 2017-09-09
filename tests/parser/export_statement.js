import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testLetStatement } from './utils';
import { is } from '../utils';

test('Parser - Export statement', (t) => {
  const input = 'export let greeting = "Hello World!!!"';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 1, 'program.statements contains 1 statement');

  const exportStmt = program.statements[0];

  t.ok(is(exportStmt, ast.ExportStatement), 'node is ExportStatement');
  t.equal(exportStmt.getTokenValue(), 'export', 'node.getTokenValue is "export"');
  testLetStatement(t, exportStmt.value, 'greeting');
  t.equal(exportStmt.alias, null, 'alias is not present');

  t.end();
});
