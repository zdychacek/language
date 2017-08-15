import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { testIdentifier, testInfixExpression } from './utils';

test('Parser - If/else if expression', (t) => {
  const input =
`if x < y {
  x
}
else if x > z  {
  y
}`;

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
  t.equal(expression.consequence.statements.length, 1, 'consequence has one statement');

  const consequence = expression.consequence.statements[0];

  t.ok(consequence instanceof ast.ExpressionStatement, 'consequence.statements[0] is ast.ExpressionStatement');
  testIdentifier(t, consequence.expression, 'x');

  // test alternative branch (else if)
  const alternative = expression.alternative;

  t.ok(alternative instanceof ast.IfExpression, 'alternative is ast.IfExpression');
  testInfixExpression(t, alternative.condition, 'x', '>', 'z');
  t.equal(alternative.consequence.statements.length, 1, 'alternative.consequence has one statement');

  const alternativeConsequence = alternative.consequence.statements[0];

  t.ok(alternativeConsequence instanceof ast.ExpressionStatement, 'alternative.consequence.statements[0] is ast.ExpressionStatement');
  testIdentifier(t, alternativeConsequence.expression, 'y');

  t.end();
});
