export function checkToken (tests, { t, lexer }) {
  tests.forEach(([ expectedType, expectedValue ], i) => {
    const { type, value } = lexer.nextToken();

    t.equal(type, expectedType, `tests[${i}] - tokenType is ${expectedType}`);
    t.equal(value, expectedValue, `tests[${i}] - value is ${expectedValue}`);
  });
}
