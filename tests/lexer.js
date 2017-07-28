const test = require('tape');
const TokenType = require('../src/token');
const Lexer = require('../src/lexer');

test('#nextToken', (t) => {
  const input = '=+(){},;';
  const expected = [
    [ TokenType.ASSIGN, '=' ],
    [ TokenType.PLUS, '+' ],
    [ TokenType.LPAREN, '(' ],
    [ TokenType.RPAREN, ')' ],
    [ TokenType.LBRACE, '{' ],
    [ TokenType.RBRACE, '}' ],
    [ TokenType.COMMA, ',' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  expected.forEach((test) => {
    const { type, literal } = lexer.nextToken();

    t.ok(type === test[0]);
    t.ok(literal === test[1]);
  });

  t.end();
});
