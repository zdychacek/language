import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import { testLiteralExpression } from './utils';

test('Parser - Boolean expression', (t) => {
  const tests = [
    [ 'true', true ],
    [ 'false', false ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

    testLiteralExpression(t, program.statements[0].expression, expected);
  });

  t.end();
});
