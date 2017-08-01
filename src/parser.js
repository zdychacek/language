import { TokenType } from './token';
import * as ast from './ast';

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
    this._currToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }

  parseProgram () {
    const program = new ast.Program();

    program.statements = [];

    while (!this.currTokenIs(TokenType.EOF)) {
      const stmt = this.parseStatement();

      if (stmt) {
        program.statements.push(stmt);
      }

      this.nextToken();
    }

    return program;
  }

  parseStatement () {
    switch (this._currToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement () {
    const stmt = new ast.LetStatement(this._currToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.name = new ast.Identifier(this._currToken, this._currToken.literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    // TODO: We're skipping the expressions until we
    // encounter a semicolon
    while (!this.currTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  currTokenIs (type) {
    return this._currToken.type === type;
  }

  peekTokenIs (type) {
    return this._peekToken.type === type;
  }

  expectPeek (type) {
    if (this.peekTokenIs(type)) {
      this.nextToken();

      return true;
    }
    else {
      return false;
    }
  }
}

export default Parser;
