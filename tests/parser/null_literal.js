import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { is } from '../utils';

test('Parser - Null expression', (t) => {
  const input = 'null';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

  const stmt = program.statements[0];

  t.ok(is(stmt.expression, ast.NullLiteral), 'node is NullLiteral');
  t.equal(stmt.expression.literal, 'null', 'literal value is "null"');

  t.end();
});
