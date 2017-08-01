import fs from 'fs';
import path from 'path';
import test from 'tape';

import { TokenType } from '../src/token';
import Lexer from '../src/lexer';
import { checkToken } from './utils';

test('Lexer#nextToken - if/else', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/if_else.lang'), 'utf8');

  const expected = [
    [ TokenType.IF, 'if' ],
    [ TokenType.LPAREN, '(' ],
    [ TokenType.INT, '5' ],
    [ TokenType.LT, '<' ],
    [ TokenType.INT, '10' ],
    [ TokenType.RPAREN, ')' ],
    [ TokenType.LBRACE, '{' ],
    [ TokenType.RETURN, 'return' ],
    [ TokenType.TRUE, 'true' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.RBRACE, '}' ],
    [ TokenType.ELSE, 'else' ],
    [ TokenType.LBRACE, '{' ],
    [ TokenType.RETURN, 'return' ],
    [ TokenType.FALSE, 'false' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.RBRACE, '}' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});

test('#nextToken - multi char operators', (t) => {
  const input =
`10 == 10;
10 != 9;`;

  const expected = [
    [ TokenType.INT, '10' ],
    [ TokenType.EQ, '==' ],
    [ TokenType.INT, '10' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.INT, '10' ],
    [ TokenType.NOT_EQ, '!=' ],
    [ TokenType.INT, '9' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});

test('#nextToken - token positions', (t) => {
  const input =
`let a = 10;

if (a > 10) {
  return false;
}`;

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
