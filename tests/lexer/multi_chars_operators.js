import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import { TokenType } from '../../src/lexer/token';
import { checkToken } from './utils';

test('Lexer#nextToken - multi char operators', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/multi_chars_operators.lang'), 'utf8');

  const expected = [
    [ TokenType.NUMBER, '10' ],
    [ TokenType.PUNCTUATOR, '==' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.PUNCTUATOR, '!=' ],
    [ TokenType.NUMBER, '9' ],
    [ TokenType.EOL, '' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
