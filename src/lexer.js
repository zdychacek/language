import assert from 'assert';

import {
  Token,
  TokenType,
  Punctuator,
  Keyword,
 } from './token';

class Lexer {
  _input = '';
  _index = 0;

  _columnNo = 1;
  _lineNo = 1;

  // start position of currently built token
  _currTokenStart = null;
  _currTokenStartRange = null;

  constructor (input) {
    this._input = input;
  }

  nextToken () {
    this._skipWhitespace();

    // start token
    this._startToken();

    const char = this._peekChar();

    if (this._isEOF()) {
      return this._finishToken(TokenType.EOF, '');
    }
    else if (this._isPunctuator(char)) {
      const { type, literal } = this._readPunctuator();

      return this._finishToken(type, literal);
    }
    else if (this._isLetter(char)) {
      const literal = this._readLiteral();
      let type = TokenType.IDENT;

      if (this._isKeyword(literal)) {
        type = TokenType.KEYWORD;
      }
      else if (this._isBoolean(literal)) {
        type = TokenType.BOOLEAN;
      }

      return this._finishToken(type, literal);
    }
    else if (this._isDigit(char)) {
      const literal = this._readDigit();

      return this._finishToken(TokenType.NUMBER, literal);
    }
    else {
      return this._finishToken(TokenType.ILLEGAL, char);
    }
  }

  _getChar () {
    const char = this._input[this._index];

    if (this._isLineTerminator(char)) {
      this._lineNo++;
      this._columnNo = 1;
    }
    else {
      this._columnNo++;
    }

    this._index++;

    return char;
  }

  _peekChar (distance = 0) {
    if (this._index >= this._input.length) {
      return null;
    }
    else {
      return this._input[this._index + distance];
    }
  }

  _readPunctuator () {
    let punctuator = '';

    switch (this._peekChar()) {
      case Punctuator.SEMICOLON:
      case Punctuator.LPAREN:
      case Punctuator.RPAREN:
      case Punctuator.COMMA:
      case Punctuator.LBRACE:
      case Punctuator.RBRACE:
      case Punctuator.PLUS:
      case Punctuator.MINUS:
      case Punctuator.ASTERISK:
      case Punctuator.SLASH:
      case Punctuator.LT:
      case Punctuator.GT:
        return new Token(TokenType.PUNCTUATOR, this._getChar());
      case Punctuator.ASSIGN:
        punctuator = this._getChar();

        if (this._peekChar() === '=') {
          punctuator += this._getChar();
        }

        return new Token(TokenType.PUNCTUATOR, punctuator);
      case Punctuator.BANG:
        punctuator = this._getChar();

        if (this._peekChar() === '=') {
          punctuator += this._getChar();
        }

        return new Token(TokenType.PUNCTUATOR, punctuator);
    }
  }

  _readLiteral () {
    let literal = '';

    while (this._isLetter(this._peekChar())) {
      literal += this._getChar();
    }

    return literal;
  }

  _readDigit () {
    let literal = '';

    while (this._isDigit(this._peekChar())) {
      literal += this._getChar();
    }

    return literal;
  }

  _isPunctuator (char) {
    return Object.values(Punctuator).join('').includes(char);
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

  _isWhitespace (char) {
    return /\s/.test(char);
  }

  _isEOF () {
    return this._index >= this._input.length;
  }

  _isKeyword (literal) {
    return Object.values(Keyword).includes(literal);
  }

  _isBoolean (literal) {
    return [ 'true', 'false' ].includes(literal);
  }

  _skipWhitespace () {
    while (this._isWhitespace(this._peekChar())) {
      this._getChar();
    }
  }

  _startToken () {
    assert(!this._currTokenStart, 'Can\'t start token.');

    this._currTokenStartRange = this._index;

    return this._currTokenStart = [ this._lineNo, this._columnNo ];
  }

  _finishToken (type, literal) {
    assert(this._currTokenStart, 'Can\'t finish token.');

    const token = new Token(
      type,
      literal,
      this._currTokenStart,
      [ this._lineNo, this._columnNo ],
      [ this. _currTokenStartRange, this._index ],
    );

    this._currTokenStart = null;

    return token;
  }
}

export default Lexer;
