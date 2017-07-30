const TokenType = {
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

const PunctuatorType = {
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

const KeywordType = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
};

module.exports = { TokenType, PunctuatorType, KeywordType };
