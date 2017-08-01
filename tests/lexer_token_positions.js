import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../src/lexer';

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

    if (start[0] !== expectedStart[0] || start[1] !== expectedStart[1]) {
      t.fail(`tests[${i}] - start position wrong, expected = ${expectedStart}, got = ${start}`);
    }
    else {
      t.pass(`tests[${i}] - start position`);
    }

    if (end[0] !== expectedEnd[0] || end[1] !== expectedEnd[1]) {
      t.fail(`tests[${i}] - end position wrong, expected = ${expectedStart}, got = ${end}`);
    }
    else {
      t.pass(`tests[${i}] - end position`);
    }
  });

  t.end();
});
