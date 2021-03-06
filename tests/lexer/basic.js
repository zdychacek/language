import fs from 'fs';
import path from 'path';
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import { TokenType } from '../../src/lexer/token';
import { checkToken } from './utils';

test('Lexer#nextToken - basic', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/basic.lang'), 'utf8');

  const expected = [
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.NUMBER, '5' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, '_1' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.NUMBER, '1' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.NUMBER, '10' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.PUNCTUATOR, '(' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.PUNCTUATOR, ',' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.PUNCTUATOR, '->' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.EOL, '' ],
    [ TokenType.IDENT, 'x' ],
    [ TokenType.PUNCTUATOR, '+' ],
    [ TokenType.IDENT, 'y' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'let' ],
    [ TokenType.IDENT, 'result' ],
    [ TokenType.PUNCTUATOR, '=' ],
    [ TokenType.IDENT, 'add' ],
    [ TokenType.PUNCTUATOR, '(' ],
    [ TokenType.IDENT, 'five' ],
    [ TokenType.PUNCTUATOR, ',' ],
    [ TokenType.IDENT, 'ten' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.EOL, '' ],
    [ TokenType.STRING, 'foobar' ],
    [ TokenType.EOL, '' ],
    [ TokenType.STRING, 'foo bar' ],
    [ TokenType.EOL, '' ],
    [ TokenType.STRING, '' ],
    [ TokenType.EOL, '' ],
    [ TokenType.STRING, 'a\nb\n' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NULL, 'null' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '[' ],
    [ TokenType.NUMBER, '1' ],
    [ TokenType.PUNCTUATOR, ',' ],
    [ TokenType.NUMBER, '2' ],
    [ TokenType.PUNCTUATOR, ']' ],
    [ TokenType.EOL, '' ],
    [ TokenType.IDENT, 'a' ],
    [ TokenType.PUNCTUATOR, '&&' ],
    [ TokenType.IDENT, 'b' ],
    [ TokenType.PUNCTUATOR, '||' ],
    [ TokenType.IDENT, 'c' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'import' ],
    [ TokenType.STRING, './module' ],
    [ TokenType.KEYWORD, 'as' ],
    [ TokenType.IDENT, 'mod' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'import' ],
    [ TokenType.STRING, './module' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'export' ],
    [ TokenType.IDENT, 'obj' ],
    [ TokenType.PUNCTUATOR, '.' ],
    [ TokenType.IDENT, 'property' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'for' ],
    [ TokenType.BOOLEAN, 'true' ],
    [ TokenType.PUNCTUATOR, '{' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'break' ],
    [ TokenType.EOL, '' ],
    [ TokenType.KEYWORD, 'continue' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '}' ],
    [ TokenType.EOL, '' ],
    [ TokenType.VOID, 'void' ],
    [ TokenType.EOL, '' ],
    [ TokenType.PUNCTUATOR, '?' ],
    [ TokenType.EOL, '' ],
    [ TokenType.IDENT, 'fn' ],
    [ TokenType.PUNCTUATOR, '?(' ],
    [ TokenType.PUNCTUATOR, ')' ],
    [ TokenType.EOL, '' ],
    [ TokenType.IDENT, 'a' ],
    [ TokenType.PUNCTUATOR, '?.' ],
    [ TokenType.IDENT, 'b' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NUMBER, '3.1415926' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NUMBER, '12e3' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NUMBER, '12.3E-2' ],
    [ TokenType.EOL, '' ],
    [ TokenType.NUMBER, '123_456.123_456' ],
    [ TokenType.EOL, '' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  checkToken(expected, { t, lexer });

  t.end();
});
