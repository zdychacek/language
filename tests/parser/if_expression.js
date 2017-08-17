import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testIdentifier, testInfixExpression } from './utils';

test('Parser - If expression 2', (t) => {
  const input = 'if x < y: x else y';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.equal(program.statements.length, 1, 'program has enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const expression = stmt.expression;

  t.ok(expression instanceof ast.IfExpression, 'stmt.expression is ast.IfExpression');

  testInfixExpression(t, expression.condition, 'x', '<', 'y');

  // test consequence branch
  const consequence = expression.consequence;

  t.ok(consequence instanceof ast.Identifier, 'consequence is ast.Identifier');

  testIdentifier(t, consequence, 'x');

  // test alternative branch
  const alternative = expression.alternative;

  t.ok(alternative instanceof ast.Identifier, 'alternative is ast.Identifier');

  testIdentifier(t, alternative, 'y');

  t.end();
});
