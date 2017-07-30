// Lexer implementation

const { TokenType, PunctuatorType, KeywordType } = require('./token');

function newToken (type, literal) {
  return { type, literal: String(literal) };
}

class Lexer {
  constructor (input) {
    this._input = input;
    this._position = 0;
    this._readPosition = 0;
    this._char = null;

    this._readChar();
  }

  _readChar () {
    if (this._readPosition >= this._input.length) {
      this._char = null;
    }
    else {
      this._char = this._input[this._readPosition];
    }

    this._position = this._readPosition;
    this._readPosition++;
  }

  nextToken () {
    this._skipWhitespace();

    const char = this._char;
    let token = null;

    if (char === null) {
      token = newToken(TokenType.EOF, '');
    }
    else if (this._isPunctuator(char)) {
      token = this._readPunctuator();
    }
    else if (this._isLetter(char)) {
      const literal = this._readLiteral();

      return newToken(KeywordType[literal] || TokenType.IDENT, literal);
    }
    else if (this._isDigit(char)) {
      const literal = this._readDigit();

      return newToken(TokenType.INT, literal);
    }
    else {
      token = newToken(TokenType.ILLEGAL, char);
    }

    this._readChar();

    return token;
  }

  _peekChar () {
    if (this._readPosition >= this._input.length) {
      return null;
    }
    else {
      return this._input[this._readPosition];
    }
  }

  _readPunctuator () {
    switch (this._char) {
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
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          return newToken(TokenType.EQ, `${char}${this._char}`);
        }

        return newToken(TokenType.ASSIGN, '=');
      case '!':
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          return newToken(TokenType.NOT_EQ, `${char}${this._char}`);
        }

        return newToken(TokenType.BANG, '!');
      default:
        return null;
    }
  }

  _readLiteral () {
    const position = this._position;

    while (this._isLetter(this._char)) {
      this._readChar();
    }

    return this._input.slice(position, this._readPosition - 1);
  }

  _readDigit () {
    const position = this._position;

    while (this._isDigit(this._char)) {
      this._readChar();
    }

    return this._input.slice(position, this._readPosition - 1);
  }

  _isPunctuator (char) {
    return Object.keys(PunctuatorType).includes(char);
  }

  _isLetter (char) {
    return (
      char >= 'a' && char <= 'z' ||
      char >= 'A' && char <= 'Z' ||
      char === '_'
    );
  }

  _isDigit (char) {
    return char >= '0' && char <= '9';
  }

  _skipWhitespace () {
    while (
      this._char === ' ' ||
      this._char === '\t' ||
      this._char === '\n' ||
      this._char === '\r'
    ) {
      this._readChar();
    }
  }
}

module.exports = Lexer;
