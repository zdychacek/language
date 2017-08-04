export const TokenType = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  // Identifiers + literals
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456

  // Operators
  BANG: '!',
  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  ASTERISK: '*',
  SLASH: '/',
  LT: '<',
  GT: '>',
  EQ: '==',
  NOT_EQ: '!=',

  // Delimiters
  COMMA: ',',
  SEMICOLON: ';',
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',

  // Keywords
  FUNCTION: 'FUNCTION',
  LET: 'LET',
  IF: 'IF',
  ELSE: 'ELSE',
  RETURN: 'RETURN',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
};

export const PunctuatorType = {
  ';': TokenType.SEMICOLON,
  '(': TokenType.LPAREN,
  ')': TokenType.RPAREN,
  ',': TokenType.COMMA,
  '{': TokenType.LBRACE,
  '}': TokenType.RBRACE,
  '=': TokenType.ASSIGN,
  '!': TokenType.BANG,
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '*': TokenType.ASTERISK,
  '/': TokenType.SLASH,
  '<': TokenType.LT,
  '>': TokenType.GT,
};

export const KeywordType = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
};

export const Precedence = {
  LOWEST: 0,
  EQUALS: 1,       // ==
  LESSGREATER: 2,  // > or <
  SUM: 3,          // +
  PRODUCT: 4,      // *
  PREFIX: 5,       // -X or !X
  CALL: 6,         // myFunction(X)
};

export const TokenPrecedence = {
  [TokenType.EQ]: Precedence.EQUALS,
  [TokenType.NOT_EQ]: Precedence.EQUALS,
  [TokenType.LT]: Precedence.LESSGREATER,
  [TokenType.GT]: Precedence.LESSGREATER,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.SLASH]: Precedence.PRODUCT,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
};

export class Token {
  constructor (type, literal, start, end, range) { // eslint-disable-line max-params
    this.type = type;
    this.literal = literal;
    this.start = start;
    this.end = end;
    this.range = range;
  }
}
