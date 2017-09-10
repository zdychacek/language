import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { is } from '../utils';

test('Parser - Void literal expression', (t) => {
  const input = 'void';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

  const stmt = program.statements[0];

  t.ok(is(stmt.expression, ast.VoidLiteral), 'node is VoidLiteral');
  t.equal(stmt.expression.literal, 'void', 'literal value is "void"');

  t.end();
});
