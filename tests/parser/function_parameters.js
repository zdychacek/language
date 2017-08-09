import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { checkParserErrors, testLiteralExpression } from './utils';

test.only('Parser - Function parameters', (t) => {
  const tests = [
    [ 'fn() {};', [] ],
    [ 'fn(x) {};', [ 'x' ] ],
    // trailing comma
    [ 'fn(x, y,) {};', [ 'x', 'y' ] ],
    [ 'fn(x, y, z) {};', [ 'x', 'y', 'z' ] ],
  ];

  tests.forEach(([ input, expectedParams ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    checkParserErrors(t, parser);

    const stmt = program.statements[0];
    const fn = stmt.expression;

    t.equal(fn.parameters.length, expectedParams.length, 'function has right parameters count');

    expectedParams.forEach((param, i) => {
      testLiteralExpression(t, fn.parameters[i], param);
    });
  });

  t.end();
});
