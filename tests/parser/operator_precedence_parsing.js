import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import { checkParserErrors } from './utils';

test('Parser - Operator Precedence Parsing', (t) => {
  const tests = [
    [ '-a * b', '((-a) * b)' ],
    [ '!-a', '(!(-a))' ],
    [ 'a + b + c', '((a + b) + c)' ],
    [ 'a + b - c', '((a + b) - c)' ],
    [ 'a * b * c', '((a * b) * c)' ],
    [ 'a * b / c', '((a * b) / c)' ],
    [ 'a + b / c', '(a + (b / c))' ],
    [ 'a + b * c + d / e - f', '(((a + (b * c)) + (d / e)) - f)' ],
    [ '3 + 4; -5 * 5', '(3 + 4)((-5) * 5)' ],
    [ '5 > 4 == 3 < 4', '((5 > 4) == (3 < 4))' ],
    [ '5 < 4 != 3 > 4', '((5 < 4) != (3 > 4))' ],
    [ '3 + 4 * 5 == 3 * 1 + 4 * 5', '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    checkParserErrors(t, parser);

    t.equal(program.toString(), expected);
  });

  t.end();
});
