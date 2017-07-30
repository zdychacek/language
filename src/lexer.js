// Lexer implementation

const { TokenType, PunctuatorType, KeywordType } = require('./token');

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

  peekChar () {
    if (this.readPosition >= this.input.length) {
      return null;
    }
    else {
      return this.input[this.readPosition];
    }
  }

  nextToken () {
    this.skipWhitespace();

    const char = this.ch;
    let token = null;

    if (char === null) {
      token = newToken(TokenType.EOF, '');
    }
    else if (this.isPunctuator(char)) {
      token = this.readPunctuator();
    }
    else if (this.isLetter(char)) {
      const literal = this.readLiteral();

      return newToken(KeywordType[literal] || TokenType.IDENT, literal);
    }
    else if (this.isDigit(char)) {
      const literal = this.readDigit();

      return newToken(TokenType.INT, literal);
    }
    else {
      token = newToken(TokenType.ILLEGAL, char);
    }

    this.readChar();

    return token;
  }

  readPunctuator () {
    //this.readChar();

    switch (this.ch) {
      case ';':
        return newToken(TokenType.SEMICOLON, ';');
      case '(':
        return newToken(TokenType.LPAREN, '(');
      case ')':
        return newToken(TokenType.RPAREN, ')');
      case ',':
        return newToken(TokenType.COMMA, ',');
      case '{':
        return newToken(TokenType.LBRACE, '{');
      case '}':
        return newToken(TokenType.RBRACE, '}');
      case '+':
        return newToken(TokenType.PLUS, '+');
      case '-':
        return newToken(TokenType.MINUS, '-');
      case '*':
        return newToken(TokenType.ASTERISK, '*');
      case '/':
        return newToken(TokenType.SLASH, '/');
      case '<':
        return newToken(TokenType.LT, '<');
      case '>':
        return newToken(TokenType.GT, '>');
      case '=':
        if (this.peekChar() === '=') {
          const char = this.ch;

          this.readChar();

          return newToken(TokenType.EQ, `${char}${this.ch}`);
        }

        return newToken(TokenType.ASSIGN, '=');
      case '!':
        if (this.peekChar() === '=') {
          const char = this.ch;

          this.readChar();

          return newToken(TokenType.NOT_EQ, `${char}${this.ch}`);
        }

        return newToken(TokenType.BANG, '!');
      default:
        return null;
    }
  }

  readLiteral () {
    const position = this.position;

    while (this.isLetter(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.readPosition - 1);
  }

  readDigit () {
    const position = this.position;

    while (this.isDigit(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.readPosition - 1);
  }

  isPunctuator (char) {
    return Object.keys(PunctuatorType).includes(char);
  }

  isLetter (char) {
    return (
      char >= 'a' && char <= 'z' ||
      char >= 'A' && char <= 'Z' ||
      char === '_'
    );
  }

  isDigit (char) {
    return char >= '0' && char <= '9';
  }

  skipWhitespace () {
    while (
      this.ch === ' ' ||
      this.ch === '\t' ||
      this.ch === '\n' ||
      this.ch === '\r'
    ) {
      this.readChar();
    }
  }
}

module.exports = Lexer;
