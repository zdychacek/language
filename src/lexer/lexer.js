import assert from 'assert';

import {
  Token,
  TokenType,
  Punctuator,
  Keyword,
 } from './token';

class Lexer {
  // input source code
  _input = '';
  // current position in source code
  _index = 0;
  // column and line positions in source code
  _columnNo = 1;
  _lineNo = 1;
  // start position of currently built token
  _currTokenStart = null;
  _currTokenStartRange = null;
  // state capture structure for lookahead
  _capturedState = null;

  constructor (input) {
    this._input = input;
  }

  nextToken () {
    this._skipWhitespace();

    this._startToken();

    const char = this._peekChar();

    // end of file
    if (this._isEOF()) {
      return this._finishToken(TokenType.EOF, '');
    }
    // end of line
    else if (this._isEOL(char)) {
     while (this._isEOL(this._peekChar())) {
        this._getChar();
      }

      return this._finishToken(TokenType.EOL, '');
    }
    else if (this._isPunctuator(char)) {
      const { type, value } = this._readPunctuator();

      return this._finishToken(type, value);
    }
    else if (this._isLetter(char)) {
      const value = this._readLiteral();
      let type = TokenType.IDENT;

      if (this._isKeyword(value)) {
        type = TokenType.KEYWORD;
      }
      else if (this._isBoolean(value)) {
        type = TokenType.BOOLEAN;
      }
      else if (value === 'null') {
        type = TokenType.NULL;
      }

      return this._finishToken(type, value);
    }
    else if (this._isDigit(char)) {
      const value = this._readDigit();

      return this._finishToken(TokenType.NUMBER, value);
    }
    else if (char === '"') {
      const value = this._readString();

      return this._finishToken(TokenType.STRING, value);
    }
    else {
      return this._finishToken(TokenType.ILLEGAL, char);
    }
  }

  peek (distance = 0) {
    const peeks = [];

    // capture lexer state for revovery purpose
    this._captureState();

    // fill look ahead queue
    while (distance >= peeks.length) {
      peeks.push(this.nextToken());
    }

    // restore lexer state
    this._restoreState();

    return peeks[distance];
  }

  getCurrentPosition () {
    return [ this._lineNo, this._columnNo ];
  }

  _getChar () {
    const char = this._input[this._index];

    if (this._isEOL(char)) {
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
    if (this._isEOF()) {
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
      case Punctuator.COLON:
      case Punctuator.LPAREN:
      case Punctuator.RPAREN:
      case Punctuator.COMMA:
      case Punctuator.LBRACE:
      case Punctuator.RBRACE:
      case Punctuator.PLUS:
      case Punctuator.ASTERISK:
      case Punctuator.SLASH:
      case Punctuator.LT:
      case Punctuator.GT:
        return new Token(TokenType.PUNCTUATOR, this._getChar());
      case Punctuator.MINUS:
        punctuator = this._getChar();

        // dash arrow `->`
        if (this._peekChar() === '>') {
          punctuator += this._getChar();
        }

        return new Token(TokenType.PUNCTUATOR, punctuator);
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
    let value = '';

    while (this._isLetter(this._peekChar())) {
      value += this._getChar();
    }

    return value;
  }

  _readDigit () {
    let value = '';

    while (this._isDigit(this._peekChar())) {
      value += this._getChar();
    }

    return value;
  }

  _readString () {
    let value = '';

    this._getChar(); // read starting "

    while (this._peekChar() !== '"') {
      if (this._isEOF()) {
        throw new SyntaxError(`Unterminated string (@${this._lineNo}:${this._columnNo}).`);
      }

      value += this._getChar();
    }

    this._getChar(); // read trailing "

    return value;
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

  _isEOL (char) {
    return char === '\n';
  }

  _isWhitespace (char) {
    return char === ' ' || char === '\t';
  }

  _isEOF () {
    return this._index >= this._input.length;
  }

  _isKeyword (value) {
    return Object.values(Keyword).includes(value);
  }

  _isBoolean (value) {
    return [ 'true', 'false' ].includes(value);
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

  _finishToken (type, value) {
    assert(this._currTokenStart, 'Can\'t finish token.');

    const token = new Token(
      type,
      value,
      this._currTokenStart,
      [ this._lineNo, this._columnNo ],
      [ this. _currTokenStartRange, this._index ],
    );

    this._currTokenStart = null;

    return token;
  }

  _captureState () {
    assert(!this._capturedState, 'Trying to capture unrestored state.');

    return this._capturedState = {
      index: this._index,
      lineNo: this._lineNo,
      columnNo: this._columnNo,
    };
  }

  _restoreState () {
    assert(this._capturedState, 'No state to restore.');

    const { index, lineNo, columnNo } = this._capturedState;

    this._index = index;
    this._lineNo = lineNo;
    this._columnNo = columnNo;

    this._capturedState = null;
  }
}

export default Lexer;
