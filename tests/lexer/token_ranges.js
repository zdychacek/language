import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';

test('Lexer#nextToken - token positions', (t) => {
  const input = fs.readFileSync(path.join(__dirname, './fixtures/token_ranges.lang'), 'utf8');

  const expected = [
    [ 0, 3 ],     // let
    [ 4, 5 ],     // a
    [ 6, 7 ],     // =
    [ 8, 10 ],    // fn
    [ 11, 12 ],   // (
    [ 12, 13 ],   // )
    [ 14, 15 ],   // {
    [ 18, 24 ],   // return
    [ 25, 29 ],   // true
    [ 29, 30 ],   // ;
    [ 31, 32 ],   // }
  ];

  const lexer = new Lexer(input);

  expected.forEach(([ expectedStart, expectedEnd ], i) => {
    const { range: [ start, end ] } = lexer.nextToken();

    t.equal(start, expectedStart, `tests[${i}] - start range position is ${expectedStart}`);
    t.equal(end, expectedEnd, `tests[${i}] - end range position is ${expectedEnd}`);
  });

  t.end();
});
