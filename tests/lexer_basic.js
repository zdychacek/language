import fs from 'fs';
import path from 'path';
import test from 'tape';

import { TokenType } from '../src/token';
import Lexer from '../src/lexer';
import { checkToken } from './utils';

test('Lexer#nextToken - basic', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/basic.lang'), 'utf8');

  const expected = [
    [ TokenType.LET, 'let' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.ASSIGN, '=' ],
    [ TokenType.INT, '5' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.LET, 'let' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.ASSIGN, '=' ],
    [ TokenType.INT, '10' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.LET, 'let' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.ASSIGN, '=' ],
    [ TokenType.FUNCTION, 'fn' ],
    [ TokenType.LPAREN, '(' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.COMMA, ',' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.RPAREN, ')' ],
    [ TokenType.LBRACE, '{' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.PLUS, '+' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.RBRACE, '}' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.LET, 'let' ],
    [ TokenType.IDENT, 'result' ],
    [ TokenType.ASSIGN, '=' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.LPAREN, '(' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.COMMA, ',' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.RPAREN, ')' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
