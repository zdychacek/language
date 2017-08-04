import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import { TokenType } from '../../src/token';
import { checkToken } from './utils';

test('Lexer#nextToken - basic', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/basic.lang'), 'utf8');

  const expected = [
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.KEYWORD, 'fn' ],
    [ TokenType.PUNCTUATOR, '(' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.PUNCTUATOR, ',' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.PUNCTUATOR, '+' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'result' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.PUNCTUATOR, '(' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.PUNCTUATOR, ',' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
