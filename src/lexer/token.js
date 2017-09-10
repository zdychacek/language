export const TokenType = {
  IDENT: 'IDENT',
  LITERAL: 'LITERAL',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  NULL: 'NULL',
  VOID: 'VOID',
  STRING: 'STRING',
  KEYWORD: 'KEYWORD',
  PUNCTUATOR: 'PUNCTUATOR',
  EOF: 'EOF',
  EOL: 'EOL',
  ILLEGAL: 'ILLEGAL',
  COMMENT: 'COMMENT',
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
  LBRACKET: '[',
  RBRACKET: ']',
  PIPE: '|',
  AMPERSAND: '&',
  DOUBLE_PIPE: '||',
  DOUBLE_AMPERSAND: '&&',
  DOT: '.',
};

export const Keyword = {
  LET: 'let',
  IF: 'if',
  ELSE: 'else',
  RETURN: 'return',
  IMPORT: 'import',
  AS: 'as',
  EXPORT: 'export',
  FOR: 'for',
  CONTINUE: 'continue',
  BREAK: 'break',
};

export const BooleanLiteral = {
  TRUE: 'true',
  FALSE: 'false',
};

export const Precedence = {
  LOWEST: 0,
  SEQUENCE: 10,     // ,
  ASSIGN: 20,       // =
  BITWISE_OR: 30,   // ||
  BITWISE_AND: 31,  // &&
  EQUALS: 40,       // ==
  LESSGREATER: 50,  // > or <
  SUM: 60,          // +
  PRODUCT: 70,      // *
  PREFIX: 80,       // -X or !X
  DASH_ARROW: 90,   // ->
  CALL: 100,        // myFunction(X)
  INDEX: 110,       // [] or .
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
  [Punctuator.LBRACKET]: Precedence.INDEX,
  [Punctuator.DOT]: Precedence.INDEX,
  [Punctuator.DOUBLE_PIPE]: Precedence.BITWISE_OR,
  [Punctuator.DOUBLE_AMPERSAND]: Precedence.BITWISE_AND,
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
