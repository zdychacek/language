//import { TokenType } from './token';
//import ast from './ast';

class Parser {
  _currToken = null;
  _peekToken = null;
  _lexer = null;

  constructor (lexer) {
    this._lexer = lexer;

    // read two tokens, so _currToken and _peekToken are both set
    this.nextToken();
    this.nextToken();
  }

  nextToken () {
    this._currToken = this._peekToken();
    this._peekToken = this._lexer.nextToken();
  }

  parseProgram () {
    return null;
  }
}

export default Parser;
