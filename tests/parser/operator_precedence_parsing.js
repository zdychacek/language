import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';

test('Parser - Operator precedence parsing', (t) => {
  const tests = [
    [ '-a * b', '((-a) * b)' ],
    [ '!-a', '(!(-a))' ],
    [ 'a + b + c', '((a + b) + c)' ],
    [ 'a + b - c', '((a + b) - c)' ],
    [ 'a * b * c', '((a * b) * c)' ],
    [ 'a * b / c', '((a * b) / c)' ],
    [ 'a + b / c', '(a + (b / c))' ],
    [ 'a + b * c + d / e - f', '(((a + (b * c)) + (d / e)) - f)' ],
    [ '3 + 4\n -5 * 5', '(3 + 4)((-5) * 5)' ],
    [ '5 > 4 == 3 < 4', '((5 > 4) == (3 < 4))' ],
    [ '5 < 4 != 3 > 4', '((5 < 4) != (3 > 4))' ],
    [ '3 + 4 * 5 == 3 * 1 + 4 * 5', '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' ],
    [ 'true', 'true' ],
    [ 'false', 'false' ],
    [ '3 > 5 == false', '((3 > 5) == false)' ],
    [ '3 < 5 == true', '((3 < 5) == true)' ],
    [ '1 + (2 + 3) + 4', '((1 + (2 + 3)) + 4)' ],
    [ '(5 + 5) * 2', '((5 + 5) * 2)' ],
    [ '2 / (5 + 5)', '(2 / (5 + 5))' ],
    [ '-(5 + 5)', '(-(5 + 5))' ],
    [ '!(true == true)', '(!(true == true))' ],
    [ 'a + add(b * c) + d', '((a + add((b * c))) + d)' ],
    [ 'add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))', 'add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))' ],
    [ 'add(a + b + c * d / f + g)', 'add((((a + b) + ((c * d) / f)) + g))' ],
    [ 'a * [1, 2, 3, 4][b * c] * d', '((a * ([1, 2, 3, 4][(b * c)])) * d)' ],
    [ 'add(a * b[2], b[1], 2 * [1, 2][1])', 'add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))' ],
    [ 'a && b || c', '((a && b) || c)' ],
    [ 'a || b && c', '(a || (b && c))' ],
    [ 'a?.b()', '(a?.b)()' ],
    [ 'a?.b?()', '(a?.b)?()' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
    t.equal(program.toString(), expected);
  });

  t.end();
});
