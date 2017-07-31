import assert from 'assert';

import {
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

  // currently built token
  _currToken = null;

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
    if (prevChar === '\n') {
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
        token = this._newToken(TokenType.SEMICOLON, ';');
        break;
      case '(':
        token = this._newToken(TokenType.LPAREN, '(');
        break;
      case ')':
        token = this._newToken(TokenType.RPAREN, ')');
        break;
      case ',':
        token = this._newToken(TokenType.COMMA, ',');
        break;
      case '{':
        token = this._newToken(TokenType.LBRACE, '{');
        break;
      case '}':
        token = this._newToken(TokenType.RBRACE, '}');
        break;
      case '+':
        token = this._newToken(TokenType.PLUS, '+');
        break;
      case '-':
        token = this._newToken(TokenType.MINUS, '-');
        break;
      case '*':
        token = this._newToken(TokenType.ASTERISK, '*');
        break;
      case '/':
        token = this._newToken(TokenType.SLASH, '/');
        break;
      case '<':
        token = this._newToken(TokenType.LT, '<');
        break;
      case '>':
        token = this._newToken(TokenType.GT, '>');
        break;
      case '=':
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          token = this._newToken(TokenType.EQ, `${char}${this._char}`);
        }
        else {
          token = this._newToken(TokenType.ASSIGN, '=');
        }

        break;
      case '!':
        if (this._peekChar() === '=') {
          const char = this._char;

          this._readChar();

          token = this._newToken(TokenType.NOT_EQ, `${char}${this._char}`);
        }
        else {
          token = this._newToken(TokenType.BANG, '!');
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

  _newToken (type, literal) {
    return { type, literal: String(literal) };
  }

  _startToken () {
    assert(!this._currToken, 'Can\'t start token.');

    return this._currToken = {
      start: [ this._lineNo, this._columnNo ],
    };
  }

  _finishToken (type, literal) {
    const token = Object.assign(this._currToken, this._newToken(type, literal), {
      type,
      literal: String(literal),
      end: [ this._lineNo, this._columnNo ],
    });

    this._currToken = null;

    return token;
  }
}

export default Lexer;
