import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { checkParserErrors, testLiteralExpression } from './utils';

test('Parser - Boolean expression', (t) => {
  const tests = [
    [ 'true;', true ],
    [ 'false;', false ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    checkParserErrors(t, parser);

    testLiteralExpression(t, program.statements[0].expression, expected);
  });

  t.end();
});
