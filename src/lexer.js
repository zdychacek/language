import assert from 'assert';

import {
  Token,
  TokenType,
  PunctuatorType,
  KeywordType,
 } from './token';

class Lexer {
  _input = '';
  _position = 0;
  _readPosition = 0;
  _char = null;

  _columnNo = 0;
  _lineNo = 1;

  // start position of currently built token
  _currTokenStart = null;
  _currTokenStartRange = null;

  constructor (input) {
    this._input = input;

    this._readChar();
  }

  _readChar () {
    if (this._readPosition >= this._input.length) {
      this._char = null;
    }
    else {
      this._char = this._input[this._readPosition];
    }

    const prevChar = this._input[this._readPosition - 1];

    // update source location
    if (this._isLineTerminator(prevChar)) {
      this._lineNo++;
      this._columnNo = 1;
    }
    else {
      this._columnNo++;
    }

    this._position = this._readPosition;
    this._readPosition++;
  }

  nextToken () {
    this._skipWhitespace();

    // start token
    this._startToken();

    const char = this._char;

    if (char === null) {
      const token = this._finishToken(TokenType.EOF, '');

      this._readChar();

      return token;
    }
    else if (this._isPunctuator(char)) {
      const { type, literal } = this._readPunctuator();

      return this._finishToken(type, literal);
    }
    else if (this._isLetter(char)) {
      const literal = this._readLiteral();

      return this._finishToken(KeywordType[literal] || TokenType.IDENT, literal);
    }
    else if (this._isDigit(char)) {
      const literal = this._readDigit();

      return this._finishToken(TokenType.INT, literal);
    }
    else {
      const token = this._finishToken(TokenType.ILLEGAL, char);

      this._readChar();

      return token;
    }
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
    let token = null;

    switch (this._char) {
      case ';':
        token = new Token(TokenType.SEMICOLON, ';');
        break;
      case '(':
        token = new Token(TokenType.LPAREN, '(');
        break;
      case ')':
        token = new Token(TokenType.RPAREN, ')');
        break;
      case ',':
        token = new Token(TokenType.COMMA, ',');
        break;
      case '{':
        token = new Token(TokenType.LBRACE, '{');
        break;
      case '}':
        token = new Token(TokenType.RBRACE, '}');
        break;
      case '+':
        token = new Token(TokenType.PLUS, '+');
        break;
      case '-':
        token = new Token(TokenType.MINUS, '-');
        break;
      case '*':
        token = new Token(TokenType.ASTERISK, '*');
        break;
      case '/':
        token = new Token(TokenType.SLASH, '/');
        break;
      case '<':
        token = new Token(TokenType.LT, '<');
        break;
      case '>':
        token = new Token(TokenType.GT, '>');
        break;
      case '=':
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          token = new Token(TokenType.EQ, `${char}${this._char}`);
        }
        else {
          token = new Token(TokenType.ASSIGN, '=');
        }

        break;
      case '!':
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          token = new Token(TokenType.NOT_EQ, `${char}${this._char}`);
        }
        else {
          token = new Token(TokenType.BANG, '!');
        }

        break;
    }

    this._readChar();

    return token;
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
    return char !== null && char >= '0' && char <= '9';
  }

  _isLineTerminator (char) {
    return char === '\n';
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

  _startToken () {
    assert(!this._currTokenStart, 'Can\'t start token.');

    this._currTokenStartRange = this._position;

    return this._currTokenStart = [ this._lineNo, this._columnNo ];
  }

  _finishToken (type, literal) {
    assert(this._currTokenStart, 'Can\'t finish token.');

    const token = new Token(
      type,
      literal,
      this._currTokenStart,
      [ this._lineNo, this._columnNo ],
      [ this. _currTokenStartRange, this._position ],
    );

    this._currTokenStart = null;

    return token;
  }
}

export default Lexer;
