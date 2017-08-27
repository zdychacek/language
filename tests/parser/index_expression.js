import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testInfixExpression, testIdentifier } from './utils';
import { is } from '../utils';

test('Parser - Index expression', (t) => {
  const input = 'myArray[1 + 1]';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

  t.equal(program.statements.length, 1, 'program has not enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const indexExp = stmt.expression;

  t.ok(is(indexExp, ast.MemberExpression), 'expression is ast.MemberExpression');

  testIdentifier(t, indexExp.left, 'myArray');
  testInfixExpression(t, indexExp.index, 1, '+', 1);

  t.end();
});
