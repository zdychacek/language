import parseFunction from 'parse-function';
import {
  TokenType,
  Precedence,
  TokenPrecedence,
  Keyword,
  Punctuator,
} from './token';
import * as ast from './ast';

// Helper for serializing function body
function parsePredicate (fn) {
  return parseFunction().parse(fn).body;
}

class Parser {
  // Lexer reference
  _lexer = null;
  // current token
  _currToken = null;
  // next token
  _peekToken = null;
  // list of parser's errors
  _errors = [];
  // maps of parsers
  _prefixParsers = {};
  _infixParsers = {};
  _statementParsers = {};

  constructor (lexer) {
    this._lexer = lexer;

    // read two tokens, so _currToken and _peekToken are both set
    this.nextToken();
    this.nextToken();

    // prefix parsers
    this._registerPrefixParser(TokenType.IDENT, this.parseIdentifier);
    this._registerPrefixParser(TokenType.NUMBER, this.parseNumberLiteral);
    this._registerPrefixParser(Punctuator.BANG, this.parsePrefixExpression);
    this._registerPrefixParser(Punctuator.MINUS, this.parsePrefixExpression);

    // infix parsers
    this._registerInfixParser(Punctuator.PLUS, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.MINUS, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.SLASH, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.ASTERISK, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.ASSIGN, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.EQ, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.NOT_EQ, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.LT, this.parseInfixExpression);
    this._registerInfixParser(Punctuator.GT, this.parseInfixExpression);

    // statements
    this._registerStatement(Keyword.LET, this.parseLetStatement);
    this._registerStatement(Keyword.RETURN, this.parseReturnStatement);
    this._registerStatement(Punctuator.SEMICOLON, this.parseEmptyStatement);
  }

  nextToken () {
    this._currToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }

  getErrors () {
    return this._errors;
  }

  parseProgram = () => {
    const program = new ast.Program();

    program.statements = [];

    while (!this._currTokenIs(({ type }) => type === TokenType.EOF)) {
      const stmt = this.parseStatement();

      if (stmt) {
        program.statements.push(stmt);
      }

      this.nextToken();
    }

    return program;
  }

  parseStatement = () => {
    const statementParser = this._getStatementParser(this._currToken);

    if (statementParser) {
      return statementParser(this);
    }
    else {
      return this.parseExpressionStatement();
    }
  }

  parseLetStatement = () => {
    const stmt = new ast.LetStatement(this._currToken);

    if (!this._expectPeek(({ type }) => type === TokenType.IDENT)) {
      return null;
    }

    stmt.name = new ast.Identifier(this._currToken, this._currToken.literal);

    if (!this._expectPeek(({ literal }) => literal === Punctuator.ASSIGN)) {
      return null;
    }

    this.nextToken();

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement = () => {
    const stmt = new ast.ReturnStatement(this._currToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement = () => {
    const stmt = new ast.ExpressionStatement(this._currToken);

    stmt.expression = this.parseExpression(Precedence.LOWEST);

    if (this._peekTokenIs(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseEmptyStatement = () => {
    const stmt = new ast.EmptyStatement(this._currToken);

    this.nextToken();

    return stmt;
  }

  parseExpression = (precedence) => {
    const prefix = this._getPrefixParser(this._currToken);

    if (!prefix) {
      this._errors.push(`no prefix parse function for ${this._currToken.literal} found`);

      return null;
    }

    let leftExpr = prefix();

    while (
      this._peekTokenIs(({ literal }) => literal !== Punctuator.SEMICOLON) &&
      precedence < this._peekPrecedence()
    ) {
      const infix = this._getInfixParser(this._peekToken);

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

  parseNumberLiteral = () => {
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

  _currTokenIs (predicate) {
    return predicate(this._currToken);
  }

  _peekTokenIs (predicate) {
    return predicate(this._peekToken);
  }

  _expectPeek (predicate) {
    if (this._peekTokenIs(predicate)) {
      this.nextToken();

      return true;
    }
    else {
      this._peekError(predicate);

      return false;
    }
  }

  _peekError (predicate) {
    const { type, literal } = this._peekToken;

    this._errors.push(
      `Expected next token to fulfill ${parsePredicate(predicate)}, got ${JSON.stringify({ type, literal })} instead.`
    );
  }

  _registerPrefixParser (literal, parserFn) {
    this._prefixParsers[literal] = parserFn;
  }

  _registerInfixParser (literal, parserFn) {
    this._infixParsers[literal] = parserFn;
  }

  _registerStatement (literal, parserFn) {
    this._statementParsers[literal] = parserFn;
  }

  _getPrefixParser (token) {
    return this._prefixParsers[token.type] || this._prefixParsers[token.literal];
  }

  _getInfixParser (token) {
    return this._infixParsers[token.type] || this._infixParsers[token.literal];
  }

  _getStatementParser (token) {
    return this._statementParsers[token.literal];
  }

  _peekPrecedence () {
    return TokenPrecedence[this._peekToken.literal] || Precedence.LOWEST;
  }

  _currPrecedence () {
    return TokenPrecedence[this._currToken.literal] || Precedence.LOWEST;
  }
}

export default Parser;
