import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { testLiteralExpression } from './utils';

test('Parser - Function parameters', (t) => {
  const tests = [
    [ '() -> {}', [] ],
    [ '(x) -> x', [ 'x' ] ],
    [ '(x, y,) -> x + y', [ 'x', 'y' ] ], // trailing comma
    [ '(x, y, z) -> {}', [ 'x', 'y', 'z' ] ],
  ];

  tests.forEach(([ input, expectedParams ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

    const stmt = program.statements[0];
    const fn = stmt.expression;

    t.equal(fn.parameters.length, expectedParams.length, 'function has right parameters count');

    expectedParams.forEach((param, i) => {
      testLiteralExpression(t, fn.parameters[i], param);
    });
  });

  t.end();
});
