import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';

test('Lexer#nextToken - token positions', (t) => {
  const input = fs.readFileSync(path.join(__dirname, './fixtures/token_positions.lang'), 'utf8');

  const expected = [
    [ [ 1, 1 ], [ 1, 4 ] ],   // let
    [ [ 1, 5 ], [ 1, 6 ] ],   // a
    [ [ 1, 7 ], [ 1, 8 ] ],   // =
    [ [ 1, 9 ], [ 1, 11 ] ],  // 10
    [ [ 1, 11 ], [ 2, 1 ] ],  // EOL
    [ [ 2, 1 ], [ 2, 3 ] ],   // if
    [ [ 2, 4 ], [ 2, 5 ] ],   // (
    [ [ 2, 5 ], [ 2, 6 ] ],   // a
    [ [ 2, 7 ], [ 2, 8 ] ],   // >
    [ [ 2, 9 ], [ 2, 11 ] ],  // 10
    [ [ 2, 11 ], [ 2, 12 ] ], // )
    [ [ 2, 13 ], [ 2, 14 ] ], // {
    [ [ 2, 14 ], [ 3, 1 ] ],  // EOL
    [ [ 3, 3 ], [ 3, 9 ] ],   // return
    [ [ 3, 10 ], [ 3, 15 ] ], // false
    [ [ 3, 15 ], [ 4, 1 ] ],  // EOL
    [ [ 4, 1 ], [ 4, 2 ] ],   // }
  ];

  const lexer = new Lexer(input);

  expected.forEach(([ expectedStart, expectedEnd ], i) => {
    const { start, end } = lexer.nextToken();

    t.equal(start[0], expectedStart[0], `tests[${i}] - start line position is ${expectedStart[0]}`);
    t.equal(start[1], expectedStart[1], `tests[${i}] - start column position is ${expectedStart[1]}`);
    t.equal(end[0], expectedEnd[0], `tests[${i}] - end line position is ${expectedEnd[0]}`);
    t.equal(end[1], expectedEnd[1], `tests[${i}] - end column position is ${expectedEnd[1]}`);
  });

  t.end();
});
