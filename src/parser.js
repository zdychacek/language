import {
  TokenType,
  Precedence,
  TokenPrecedence,
} from './token';
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

    // prefix parsers
    this._registerPrefixParser(TokenType.IDENT, this.parseIdentifier);
    this._registerPrefixParser(TokenType.INT, this.parseIntegerLiteral);
    this._registerPrefixParser(TokenType.BANG, this.parsePrefixExpression);
    this._registerPrefixParser(TokenType.MINUS, this.parsePrefixExpression);

    // infix parsers
    this._registerInfixParser(TokenType.PLUS, this.parseInfixExpression);
    this._registerInfixParser(TokenType.MINUS, this.parseInfixExpression);
    this._registerInfixParser(TokenType.SLASH, this.parseInfixExpression);
    this._registerInfixParser(TokenType.ASTERISK, this.parseInfixExpression);
    this._registerInfixParser(TokenType.EQ, this.parseInfixExpression);
    this._registerInfixParser(TokenType.NOT_EQ, this.parseInfixExpression);
    this._registerInfixParser(TokenType.LT, this.parseInfixExpression);
    this._registerInfixParser(TokenType.GT, this.parseInfixExpression);
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

    this.nextToken();

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement () {
    const stmt = new ast.ReturnStatement(this._currToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement () {
    const stmt = new ast.ExpressionStatement(this._currToken);

    stmt.expression = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression (precedence) {
    const prefix = this._prefixParsers[this._currToken.type];

    if (!prefix) {
      this._errors.push(`no prefix parse function for ${this._currToken.type} found`);

      return null;
    }

    let leftExpr = prefix();

    while (!this._peekTokenIs(TokenType.SEMICOLON) && precedence < this._peekPrecedence()) {
      const infix = this._infixParsers[this._peekToken.type];

      if (!infix) {
        return null;
      }

      this.nextToken();

      leftExpr = infix(leftExpr);
    }

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

    expression.right = this.parseExpression(Precedence.PREFIX);

    return expression;
  }

  parseInfixExpression = (left) => {
    const expression = new ast.InfixExpression(this._currToken, left, this._currToken.literal);
    const precedence = this._currPrecedence();

    this.nextToken();

    expression.right = this.parseExpression(precedence);

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

  _registerPrefixParser (tokenType, parserFn) {
    this._prefixParsers[tokenType] = parserFn;
  }

  _registerInfixParser (tokenType, parserFn) {
    this._infixParsers[tokenType] = parserFn;
  }

  _peekPrecedence () {
    return TokenPrecedence[this._peekToken.type] || Precedence.LOWEST;
  }

  _currPrecedence () {
    return TokenPrecedence[this._currToken.type] || Precedence.LOWEST;
  }
}

export default Parser;
