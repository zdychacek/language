import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import { TokenType } from '../../src/token';
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
