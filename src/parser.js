import { TokenType, Precendence } from './token';
import * as ast from './ast';

class Parser {
  _currToken = null;
  _peekToken = null;
  _lexer = null;
  _errors = [];
  _prefixParsers = [];
  _infixParsers = [];

  constructor (lexer) {
    this._lexer = lexer;

    // read two tokens, so _currToken and _peekToken are both set
    this.nextToken();
    this.nextToken();

    this._registerPrefix(TokenType.IDENT, this.parseIdentifier);
    this._registerPrefix(TokenType.INT, this.parseIntegerLiteral);
    this._registerPrefix(TokenType.BANG, this.parsePrefixExpression);
    this._registerPrefix(TokenType.MINUS, this.parsePrefixExpression);
  }

  nextToken () {
    this._currToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }

  getErrors () {
    return this._errors;
  }

  parseProgram () {
    const program = new ast.Program();

    program.statements = [];

    while (!this._currTokenIs(TokenType.EOF)) {
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
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement () {
    const stmt = new ast.LetStatement(this._currToken);

    if (!this._expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.name = new ast.Identifier(this._currToken, this._currToken.literal);

    if (!this._expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    // TODO: We're skipping the expressions until we
    // encounter a semicolon
    while (!this._currTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement () {
    const stmt = new ast.ReturnStatement(this._currToken);

    this.nextToken();

    while (!this._currTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement () {
    const stmt = new ast.ExpressionStatement(this._currToken);

    stmt.expression = this.parseExpression(Precendence.LOWEST);

    if (this._peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression () {
    const prefix = this._prefixParsers[this._currToken.type];

    if (!prefix) {
      this._errors.push(`no prefix parse function for ${this._currToken.type} found`);

      return null;
    }

    const leftExpr = prefix();

    return leftExpr;
  }

  parseIdentifier = () => {
    return new ast.Identifier(this._currToken, this._currToken.literal);
  }

  parseIntegerLiteral = () => {
    const literal = new ast.IntegerLiteral(this._currToken);
    const value = Number.parseInt(this._currToken.literal, 10);

    if (!Number.isInteger(value)) {
      this._errors.push(`could not parse ${this._currToken.literal} as integer`);

      return null;
    }

    literal.value = value;

    return literal;
  }

  parsePrefixExpression = () => {
    const expression = new ast.PrefixExpression(this._currToken, this._currToken.literal);

    this.nextToken();

    expression.right = this.parseExpression(Precendence.PREFIX);

    return expression;
  }

  _currTokenIs (type) {
    return this._currToken.type === type;
  }

  _peekTokenIs (type) {
    return this._peekToken.type === type;
  }

  _expectPeek (type) {
    if (this._peekTokenIs(type)) {
      this.nextToken();

      return true;
    }
    else {
      this._peekError(type);

      return false;
    }
  }

  _peekError (type) {
    const msg = `expected next token to be ${type}, got ${this._peekToken.type} instead`;

    this._errors.push(msg);
  }

  _registerPrefix (tokenType, parserFn) {
    this._prefixParsers[tokenType] = parserFn;
  }

  _registerInfix (tokenType, parserFn) {
    this._infixParsers[tokenType] = parserFn;
  }
}

export default Parser;
