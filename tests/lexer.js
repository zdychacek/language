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

  expected.forEach(([ expectedType, expectedLiteral ]) => {
    const { type, literal } = lexer.nextToken();

    t.ok(type === expectedType);
    t.ok(literal === expectedLiteral);
  });

  t.end();
});
