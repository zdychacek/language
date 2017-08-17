import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import { TokenType } from '../../src/lexer/token';
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
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'return' ],
    [ TokenType.BOOLEAN, 'true' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'else' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'return' ],
    [ TokenType.BOOLEAN, 'false' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.EOL, '' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
