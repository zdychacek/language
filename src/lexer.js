// Lexer implementation

const TokenType = require('./token');

function newToken (type, literal) {
  return { type, literal: String(literal) };
}

class Lexer {
  constructor (input) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = null;

    this.readChar();
  }

  readChar () {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    }
    else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition++;
  }

  nextToken () {
    const tokenTypesMap = {
      '=': TokenType.ASSIGN,
      ';': TokenType.SEMICOLON,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN,
      ',': TokenType.COMMA,
      '+': TokenType.PLUS,
      '{': TokenType.LBRACE,
      '}': TokenType.RBRACE,
    };

    let token = null;

    if (this.ch === null) {
      token = newToken(TokenType.EOF, '');
    }
    else {
      token = newToken(tokenTypesMap[this.ch], this.ch);
    }

    this.readChar();

    return token;
  }
}


module.exports = Lexer;
