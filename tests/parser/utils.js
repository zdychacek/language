export function checkParserErrors (t, parser) {
  const errors = parser.getErrors();

  t.notOk(errors.length, `parser has ${errors.length} errors`);

  errors.forEach((error) => t.fail(`parser error: ${error}`));
}
