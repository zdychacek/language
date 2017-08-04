import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer';
import { TokenType } from '../../src/token';
import { checkToken } from './utils';

test('Lexer#nextToken - operators', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/operators.lang'), 'utf8');

  const expected = [
    [ TokenType.PUNCTUATOR, '!' ],
    [ TokenType.PUNCTUATOR, '-' ],
    [ TokenType.PUNCTUATOR, '/' ],
    [ TokenType.PUNCTUATOR, '*' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.PUNCTUATOR, '<' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.PUNCTUATOR, '>' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.PUNCTUATOR, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});