import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testIdentifier, testStringLiteral } from './utils';

test('Parser - Import statement', (t) => {
  const input = 'import a from "./module"';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 1, 'program.statements contains 1 statement');

  const importStmt = program.statements[0];

  t.ok(importStmt instanceof ast.ImportStatement, 'node is ImportStatement');
  t.equal(importStmt.getTokenValue(), 'import', 'node.getTokenValue is "import"');
  testIdentifier(t, importStmt.specifier, 'a');
  testStringLiteral(t, importStmt.source, './module');

  t.end();
});
