export const TokenType = {
  IDENT: 'IDENT',
  LITERAL: 'LITERAL',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  KEYWORD: 'KEYWORD',
  PUNCTUATOR: 'PUNCTUATOR',
  EOF: 'EOF',
  ILLEGAL: 'ILLEGAL',
};

export const Punctuator = {
  SEMICOLON: ';',
  LPAREN: '(',
  RPAREN: ')',
  COMMA: ',',
  LBRACE: '{',
  RBRACE: '}',
  ASSIGN: '=',
  EQ: '==',
  NOT_EQ: '!=',
  BANG: '!',
  PLUS: '+',
  MINUS: '-',
  ASTERISK: '*',
  SLASH: '/',
  LT: '<',
  GT: '>',
};

export const Keyword = {
  FN: 'fn',
  LET: 'let',
  IF: 'if',
  ELSE: 'else',
  RETURN: 'return',
};

export const BooleanLiteral = {
  TRUE: 'true',
  FALSE: 'false',
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
  [Punctuator.EQ]: Precedence.EQUALS,
  [Punctuator.NOT_EQ]: Precedence.EQUALS,
  [Punctuator.LT]: Precedence.LESSGREATER,
  [Punctuator.GT]: Precedence.LESSGREATER,
  [Punctuator.PLUS]: Precedence.SUM,
  [Punctuator.MINUS]: Precedence.SUM,
  [Punctuator.SLASH]: Precedence.PRODUCT,
  [Punctuator.ASTERISK]: Precedence.PRODUCT,
};

export class Token {
  constructor (type, value, start, end, range) { // eslint-disable-line max-params
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
    this.range = range;
  }
}
