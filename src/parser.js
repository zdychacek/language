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
  // list of parser's errors
  _errors = [];
  // maps of parsers
  _prefixParsers = {};
  _infixParsers = {};
  _statementParsers = {};

  constructor (lexer) {
    this._lexer = lexer;

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

  getErrors () {
    return this._errors;
  }

  parseProgram = () => {
    const program = new ast.Program();

    program.statements = [];

    while (!this._match(({ type }) => type === TokenType.EOF)) {
      const stmt = this.parseStatement();

      if (stmt) {
        program.statements.push(stmt);
      }

      if (this._match(({ literal }) => literal === Punctuator.SEMICOLON)) {
        this._consume();
      }
    }

    return program;
  }

  parseStatement = () => {
    const statementParser = this._getStatementParser(this._peek());

    if (statementParser) {
      return statementParser(this);
    }
    else {
      return this.parseExpressionStatement();
    }
  }

  parseLetStatement = () => {
    let token = this._consume(({ literal }) => literal === Keyword.LET);
    const stmt = new ast.LetStatement(token);

    token = this._consume(({ type }) => type === TokenType.IDENT);

    stmt.name = new ast.Identifier(token, token.literal);

    this._consume(({ literal }) => literal === Punctuator.ASSIGN);

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._match(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this._consume();
    }

    return stmt;
  }

  parseReturnStatement = () => {
    const token = this._consume(({ literal }) => literal === Keyword.RETURN);
    const stmt = new ast.ReturnStatement(token);

    stmt.returnValue = this.parseExpression(Precedence.LOWEST);

    if (this._match(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this._consume();
    }

    return stmt;
  }

  parseExpressionStatement = () => {
    const stmt = new ast.ExpressionStatement(this._currToken);

    stmt.expression = this.parseExpression(Precedence.LOWEST);

    if (this._match(({ literal }) => literal === Punctuator.SEMICOLON)) {
      this._consume();
    }

    return stmt;
  }

  parseEmptyStatement = () => {
    return new ast.EmptyStatement(
      this._consume(({ type }) => type === Punctuator.SEMICOLON)
    );
  }

  parseExpression = (precedence) => {
    let token = this._peek();
    const prefix = this._getPrefixParser(token);

    if (!prefix) {
      this._errors.push(`No prefix parse function for ${token.literal} found.`);

      return null;
    }

    let leftExpr = prefix();

    while (
      !this._match(({ literal }) => literal === Punctuator.SEMICOLON) &&
      precedence < this._getPeekPrecendence()
    ) {
      token = this._peek();

      const infix = this._getInfixParser(token);

      if (!infix) {
        return null;
      }

      leftExpr = infix(leftExpr);
    }

    return leftExpr;
  }

  parseIdentifier = () => {
    const token = this._consume(({ type }) => type === TokenType.IDENT);

    return new ast.Identifier(token, token.literal);
  }

  parseNumberLiteral = () => {
    const token = this._consume(({ type }) => type === TokenType.NUMBER);
    const literal = new ast.IntegerLiteral(token);
    const value = Number.parseInt(token.literal, 10);

    if (!Number.isInteger(value)) {
      this._errors.push(`Could not parse ${token.literal} as integer.`);

      return null;
    }

    literal.value = value;

    return literal;
  }

  parsePrefixExpression = () => {
    const token = this._consume();
    const expression = new ast.PrefixExpression(token, token.literal);

    expression.right = this.parseExpression(Precedence.PREFIX);

    return expression;
  }

  parseInfixExpression = (left) => {
    const token = this._consume();

    const expression = new ast.InfixExpression(token, left, token.literal);
    const precedence = TokenPrecedence[token.literal] || TokenPrecedence.LOWEST;

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  _peek (distance = 0) {
    return this._lexer.peek(distance);
  }

  _match (predicate) {
    const token = this._peek();

    return token && predicate(token);
  }

  _consume (predicate) {
    if (predicate) {
      const token = this._peek();

      if (!token || !predicate(token)) {
        const { type, literal } = token;

        this._errors.push(
          `Expected next token to fulfill ${parsePredicate(predicate)}, got ${JSON.stringify({ type, literal })} instead.` // eslint-disable-line max-len
        );
      }
    }

    return this._lexer.nextToken();
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

  _getPeekPrecendence () {
    return TokenPrecedence[this._peek().literal] || Precedence.LOWEST;
  }
}

export default Parser;
