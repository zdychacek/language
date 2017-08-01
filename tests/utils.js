export function checkToken (tests, { t, lexer }) {
  tests.forEach(([ expectedType, expectedLiteral ], i) => {
    const { type, literal } = lexer.nextToken();

    if (type !== expectedType) {
      t.fail(`tests[${i}] - tokenType wrong, expected = ${expectedType}, got = ${type}`);
    }
    else {
      t.pass(`tests[${i}] - tokenType`);
    }

    if (literal !== expectedLiteral) {
      t.fail(`tests[${i}] - literal wrong, expected = ${expectedLiteral}, got = ${literal}`);
    }
    else {
      t.pass(`tests[${i}] - literal`);
    }
  });
}
