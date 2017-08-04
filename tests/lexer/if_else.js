import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import { TokenType } from '../../src/token';
import { checkToken } from './utils';

test('Lexer#nextToken - if/else', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/if_else.lang'), 'utf8');

  const expected = [
    [ TokenType.KEYWORD, 'if' ],
    [ TokenType.PUNCTUATOR, '(' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.PUNCTUATOR, '<' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.KEYWORD, 'return' ],
    [ TokenType.BOOLEAN, 'true' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.KEYWORD, 'else' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.KEYWORD, 'return' ],
    [ TokenType.BOOLEAN, 'false' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});