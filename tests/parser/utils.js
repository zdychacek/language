import * as ast from '../../src/parser/ast';

export function testNumberLiteral (t, node, expected) {
  t.ok(node instanceof ast.NumberLiteral, 'node is ast.NumberLiteral');
  t.equal(node.literal, expected, `node.literal is ${expected}`);
  t.equal(node.literal, expected, `node.literal value is "${expected}"`);
}

export function testBooleanLiteral (t, node, expected) {
  t.ok(node instanceof ast.BooleanLiteral, 'node is ast.BooleanLiteral');
  t.equal(node.literal, expected, `node.literal is ${expected}`);
  t.equal(node.getTokenValue(), expected.toString(), `node.getTokenValue() is "${expected.toString()}"`);
}

export function testStringLiteral (t, node, expected) {
  t.ok(node instanceof ast.StringLiteral, 'node is ast.StringLiteral');
  t.equal(node.literal, expected, `node.literal is ${expected}`);
  t.equal(node.getTokenValue(), expected.toString(), `node.getTokenValue() is "${expected.toString()}"`);
}

export function testIdentifier (t, node, expected) {
  t.ok(node instanceof ast.Identifier, 'node is ast.Identifier');
  t.equal(node.value, expected, `node.value is ${expected}`);
  t.equal(node.getTokenValue(), expected, `node.getTokenValue() is "${expected}"`);
}

export function testLiteralExpression (t, node, expected) {
  if (typeof expected === 'number') {
    return testNumberLiteral(t, node, expected);
  }
  else if (typeof expected === 'boolean') {
    return testBooleanLiteral(t, node, expected);
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

export function testLetStatement (t, node, expected) {
  t.ok(node instanceof ast.LetStatement, 'node is LetStatement');
  t.equal(node.name.value, expected, `node.name.value is "${expected}"`);
  t.equal(node.getTokenValue(), 'let', 'node.getTokenValue is "let"');
}
