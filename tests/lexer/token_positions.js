import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';

test('Lexer#nextToken - token positions', (t) => {
  const input = fs.readFileSync(path.join(__dirname, './fixtures/token_positions.lang'), 'utf8');

  const expected = [
    [ [ 1, 1 ], [ 1, 4 ] ],   // let
    [ [ 1, 5 ], [ 1, 6 ] ],   // a
    [ [ 1, 7 ], [ 1, 8 ] ],   // =
    [ [ 1, 9 ], [ 1, 11 ] ],  // 10
    [ [ 1, 11 ], [ 1, 12 ] ], // ;
    [ [ 3, 1 ], [ 3, 3 ] ],   // if
    [ [ 3, 4 ], [ 3, 5 ] ],   // (
    [ [ 3, 5 ], [ 3, 6 ] ],   // a
    [ [ 3, 7 ], [ 3, 8 ] ],   // >
    [ [ 3, 9 ], [ 3, 11 ] ],  // 10
    [ [ 3, 11 ], [ 3, 12 ] ], // )
    [ [ 3, 13 ], [ 3, 14 ] ], // {
    [ [ 4, 3 ], [ 4, 9 ] ],   // return
    [ [ 4, 10 ], [ 4, 15 ] ], // false
    [ [ 4, 15 ], [ 4, 16 ] ], // ;
    [ [ 5, 1 ], [ 5, 2 ] ],   // }
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
