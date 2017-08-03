import * as ast from '../../src/ast';

export function checkParserErrors (t, parser) {
  const errors = parser.getErrors();

  t.notOk(errors.length, `parser has ${errors.length} errors`);

  errors.forEach((error) => t.fail(`parser error: ${error}`));
}

export function testIntegerLiteral (t, literal, value) {
  t.ok(literal instanceof ast.IntegerLiteral, 'literal is ast.IntegerLiteral');
  t.equal(literal.value, value, `integer.value is ${value}`);
  t.equal(literal.tokenLiteral(), value.toString(), `integer.tokenLiteral() is ${value}`);
}
