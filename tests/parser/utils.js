import * as ast from '../../src/ast';

export function checkParserErrors (t, parser) {
  const errors = parser.getErrors();

  t.notOk(errors.length, `parser has ${errors.length} errors`);

  errors.forEach((error) => t.fail(`parser error: ${error}`));
}

export function testNumberLiteral (t, node, expected) {
  t.ok(node instanceof ast.NumberLiteral, 'node is ast.NumberLiteral');
  t.equal(node.literal, expected, `node.literal is ${expected}`);
  t.equal(node.tokenValue(), expected.toString(), `node.tokenValue() is ${expected}`);
}

export function testIdentifier (t, node, expected) {
  t.ok(node instanceof ast.Identifier, 'node is ast.Identifier');
  t.equal(node.value, expected, `node.value is ${expected}`);
  t.equal(node.tokenValue(), expected, `node.tokenValue() is ${expected}`);
}

export function testLiteralExpression (t, node, expected) {
  if (typeof expected === 'number') {
    return testNumberLiteral(t, node, expected);
  }
  else if (typeof expected === 'string') {
    return testIdentifier(t, node, expected);
  }

  t.fail('Type of node not handled.');
}

export function testInfixExpression (t, node, left, operator, right) { // eslint-disable-line max-params
  t.ok(node instanceof ast.InfixExpression, 'node is ast.InfixExpression');

  testLiteralExpression(t, node.left, left);

  t.equal(node.operator, operator, `operator is ${operator}`);

  testLiteralExpression(t, node.right, right);
}
