export const TokenType = {
  IDENT: 'IDENT',
  LITERAL: 'LITERAL',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  KEYWORD: 'KEYWORD',
  PUNCTUATOR: 'PUNCTUATOR',
  EOF: 'EOF',
  EOL: 'EOL',
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
  DASH_ARROW: '->',
  COLON: ':',
};

export const Keyword = {
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
  SEQUENCE: 5,      // ,
  ASSIGN: 7,        // =
  EQUALS: 10,       // ==
  LESSGREATER: 20,  // > or <
  SUM: 30,          // +
  PRODUCT: 40,      // *
  PREFIX: 50,       // -X or !X
  DASH_ARROW: 55,   // ->
  CALL: 60,         // myFunction(X)
};

export const TokenPrecedence = {
  [Punctuator.ASSIGN]: Precedence.ASSIGN,
  [Punctuator.EQ]: Precedence.EQUALS,
  [Punctuator.NOT_EQ]: Precedence.EQUALS,
  [Punctuator.LT]: Precedence.LESSGREATER,
  [Punctuator.GT]: Precedence.LESSGREATER,
  [Punctuator.PLUS]: Precedence.SUM,
  [Punctuator.MINUS]: Precedence.SUM,
  [Punctuator.SLASH]: Precedence.PRODUCT,
  [Punctuator.ASTERISK]: Precedence.PRODUCT,
  [Punctuator.LPAREN]: Precedence.CALL,
  [Punctuator.COMMA]: Precedence.SEQUENCE,
  [Punctuator.DASH_ARROW]: Precedence.DASH_ARROW,
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
