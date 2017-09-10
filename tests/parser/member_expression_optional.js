import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testIdentifier } from './utils';
import { is } from '../utils';

test('Parser - Member expression: optional chaining (not computed)', (t) => {
  const input = 'obj?.foo';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 1, 'program.statements contains 1 statement');

  const stmt = program.statements[0];

  t.ok(is(stmt, ast.ExpressionStatement), 'program.statements[0] is ast.ExpressionStatement');

  const { expression } = stmt;

  t.ok(is(expression, ast.MemberExpression), 'node is MemberExpression');
  t.equal(expression.getTokenValue(), '?.', 'node.getTokenValue is "?."');
  t.ok(expression.optional, 'node has `optional` property set to true');
  t.notOk(expression.computed, 'node has `computed` property set to false');
  testIdentifier(t, expression.left, 'obj');
  testIdentifier(t, expression.index, 'foo');

  t.end();
});
