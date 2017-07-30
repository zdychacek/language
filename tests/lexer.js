const test = require('tape');
const { TokenType } = require('../src/token');
const Lexer = require('../src/lexer');

function run (tests, { t, lexer }) {
  tests.forEach(([ expectedType, expectedLiteral ]) => {
    const { type, literal } = lexer.nextToken();

    //console.log(type, literal);

    t.ok(type === expectedType);
    t.ok(literal === expectedLiteral);
  });
}

test('#nextToken - basic', (t) => {
  const input = `
    let five = 5;

    let ten = 10;

    let add = fn(x, y) {
      x + y;
    };

    let result = add(five, ten);
  `;

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

  run(expected, { t, lexer });

  t.end();
});

test('#nextToken - operators', (t) => {
  const input = `
    !-/*5;
    5 < 10 > 5;
  `;

  const expected = [
    [ TokenType.BANG, '!' ],
    [ TokenType.MINUS, '-' ],
    [ TokenType.SLASH, '/' ],
    [ TokenType.ASTERISK, '*' ],
    [ TokenType.INT, '5' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.INT, '5' ],
    [ TokenType.LT, '<' ],
    [ TokenType.INT, '10' ],
    [ TokenType.GT, '>' ],
    [ TokenType.INT, '5' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  run(expected, { t, lexer });

  t.end();
});

test('#nextToken - if/else', (t) => {
  const input = `
    if (5 < 10) {
      return true;
    } else {
      return false;
    }
  `;

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

  run(expected, { t, lexer });

  t.end();
});

test('#nextToken - multi char operators', (t) => {
  const input = `
    10 == 10;
    10 != 9;
  `;

  const expected = [
    [ TokenType.INT, '10' ],
    [ TokenType.EQ, '==' ],
    [ TokenType.INT, '10' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.INT, '10' ],
    [ TokenType.NOT_EQ, '!=' ],
    [ TokenType.INT, '9' ],
    [ TokenType.SEMICOLON, ';' ],
    [ TokenType.EOF, '' ],
  ];

  const lexer = new Lexer(input);

  run(expected, { t, lexer });

  t.end();
});
