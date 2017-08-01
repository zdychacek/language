import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import { TokenType } from '../../src/token';
import { checkToken } from './utils';

test('Lexer#nextToken - operators', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/operators.lang'), 'utf8');

  const expected = [
    [ TokenType.BANG, '!' ],
    [ TokenType.MINUS, '-' ],
    [ TokenType.SLASH, '/' ],
    [ TokenType.ASTERISK, '*' ],
    [ TokenType.INT, '5' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.INT, '5' ],
    [ TokenType.LT, '<' ],
    [ TokenType.INT, '10' ],
    [ TokenType.GT, '>' ],
    [ TokenType.INT, '5' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
