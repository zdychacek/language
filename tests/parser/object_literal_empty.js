import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { is } from '../utils';

test('Parser - Empty object literal', (t) => {
  const input = '({})';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.equal(program.statements.length, 1, 'program has not enough statements');

  const { expression: object } = program.statements[0];

  t.ok(is(object, ast.ObjectLiteral), 'program.statements[0] is ast.ObjectLiteral');
  t.equal(object.pairs.size, 0, 'object literal has no pairs');

  t.end();
});
