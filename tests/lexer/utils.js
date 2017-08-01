export function checkToken (tests, { t, lexer }) {
  tests.forEach(([ expectedType, expectedLiteral ], i) => {
    const { type, literal } = lexer.nextToken();

    t.equal(type, expectedType, `tests[${i}] - tokenType is ${expectedType}`);
    t.equal(literal, expectedLiteral, `tests[${i}] - literal is ${expectedLiteral}`);
  });
}
