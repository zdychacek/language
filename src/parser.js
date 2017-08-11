import {
  TokenType,
  Precedence,
  TokenPrecedence,
  Keyword,
  Punctuator,
  BooleanLiteral,
} from './token';
import * as ast from './ast';

class Parser {
  // Lexer reference
  _lexer = null;
  // map of prefix parsers, eg. `-1`
  _prefixParsers = {};
  // map of infix parsers, eg. `1 + 2`
  _infixParsers = {};
  // map of statement parsers, eg. `if`
  _statementParsers = {};

  constructor (lexer) {
    this._lexer = lexer;

    // prefix parsers
    this._registerPrefixParser(TokenType.IDENT, this.parseIdentifier);
    this._registerPrefixParser(TokenType.NUMBER, this.parseNumberLiteral);
    this._registerPrefixParser(TokenType.BOOLEAN, this.parseBooleanLiteral);
    this._registerPrefixParser(Punctuator.BANG, this.parsePrefixExpression);
    this._registerPrefixParser(Punctuator.MINUS, this.parsePrefixExpression);
    this._registerPrefixParser(Punctuator.LPAREN, this.parseGroupedExpression);
    this._registerPrefixParser(Keyword.IF, this.parseIfExpression);
    this._registerPrefixParser(Keyword.FN, this.parseFunctionLiteral);

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
    this._registerInfixParser(Punctuator.LPAREN, this.parseCallExpression);

    // statements
    this._registerStatement(Keyword.LET, this.parseLetStatement);
    this._registerStatement(Keyword.RETURN, this.parseReturnStatement);
    this._registerStatement(Punctuator.LBRACE, this.parseBlockStatement);
  }

  parseProgram = () => {
    const program = new ast.Program();

    program.statements = [];

    while (!this._matchType(TokenType.EOF)) {
      this._parseStatement(program.statements);
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
    let token = this._consume(Keyword.LET);

    const stmt = new ast.LetStatement(token);

    token = this._consumeType(TokenType.IDENT);

    stmt.name = new ast.Identifier(token, token.value);

    this._consume(Punctuator.ASSIGN);

    stmt.expression = this.parseExpression();

    return stmt;
  }

  parseReturnStatement = () => {
    const stmt = new ast.ReturnStatement(this._consume(Keyword.RETURN));

    if (!this._matchType(TokenType.EOL) && !this._matchType(TokenType.EOF)) {
      stmt.returnValue = this.parseExpression();
    }

    return stmt;
  }

  parseExpressionStatement = () => {
    return new ast.ExpressionStatement(this._peek(), this.parseExpression());
  }

  parseExpression = (precedence = Precedence.LOWEST) => {
    let token = this._peek();
    const prefix = this._getPrefixParser(token);

    if (this._matchType(TokenType.EOF)) {
      throw new SyntaxError('Unexpected end of file.');
    }

    if (!prefix) {
      const [ lineNo, columnNo ] = this._lexer.getCurrentPosition();

      throw new SyntaxError(`Unexpected token "${this._resolveTokenValue(token)}" (@${lineNo}:${columnNo}).`);
    }

    let leftExpr = prefix();

    while (precedence < this._getPeekPrecendence()) {
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
    const token = this._consumeType(TokenType.IDENT);

    return new ast.Identifier(token, token.value);
  }

  parseNumberLiteral = () => {
    const token = this._consumeType(TokenType.NUMBER);
    const value = Number.parseInt(token.value, 10);

    if (!Number.isInteger(value)) {
      throw new SyntaxError(`Could not parse ${token.value} as integer.`);
    }

    return new ast.NumberLiteral(token, value);
  }

  parseBooleanLiteral = () => {
    const token = this._consumeType(TokenType.BOOLEAN);

    return new ast.BooleanLiteral(token, token.value === BooleanLiteral.TRUE);
  }

  parseGroupedExpression = () => {
    this._consume(Punctuator.LPAREN);

    const expression = this.parseExpression();

    this._consume(Punctuator.RPAREN);

    return expression;
  }

  parseIfExpression = () => {
    const token = this._consume(Keyword.IF);

    const condition = this.parseExpression();

    let consequence = null;

    if (this._match(Punctuator.LBRACE)) {
      consequence = this.parseBlockStatement();
    }
    else {
      consequence = this.parseExpression();
    }

    this._consumeOptionalEOL();

    let alternative = null;

    if (this._match(Keyword.ELSE)) {
      this._consume();

      if (this._match(Punctuator.LBRACE)) {
        alternative = this.parseBlockStatement();
      }
      else {
        alternative = this.parseExpression();
      }
    }

    return new ast.IfExpression(token, condition, consequence, alternative);
  }

  parseBlockStatement = () => {
    const token = this._consume(Punctuator.LBRACE);
    const statements = [];

    while (!this._match(Punctuator.RBRACE) && !this._matchType(TokenType.EOF)) {
      this._parseStatement(statements);
    }

    this._consume(Punctuator.RBRACE);

    return new ast.BlockStatement(token, statements);
  }

  parseFunctionLiteral = () => {
    const token = this._consume(Keyword.FN);
    const params = [];

    this._consume(Punctuator.LPAREN);

    while (!this._match(Punctuator.RPAREN)) {
      params.push(this.parseIdentifier());

      if (!this._match(Punctuator.COMMA)) {
        break;
      }

      this._consume(Punctuator.COMMA);
    }

    this._consume(Punctuator.RPAREN);

    return new ast.FunctionLiteral(token, params, this.parseBlockStatement());
  }

  parseCallExpression = (left) => {
    const token = this._consume(Punctuator.LPAREN);
    const args = [];

    while (!this._match(Punctuator.RPAREN)) {
      args.push(this.parseExpression());

      if (!this._match(Punctuator.COMMA)) {
        break;
      }

      this._consume(Punctuator.COMMA);
    }

    this._consume(Punctuator.RPAREN);

    return new ast.CallExpression(token, left, args);
  }

  parsePrefixExpression = () => {
    const token = this._consume();
    const expression = new ast.PrefixExpression(token, token.value);

    expression.right = this.parseExpression(Precedence.PREFIX);

    return expression;
  }

  parseInfixExpression = (left) => {
    const token = this._consume();
    const expression = new ast.InfixExpression(token, left, token.value);

    expression.right = this.parseExpression(TokenPrecedence[token.value]);

    return expression;
  }

  _parseStatement (statements) {
    this._consumeOptionalEOL();

    const stmt = this.parseStatement();

    if (stmt) {
      statements.push(stmt);
    }

    if (!this._match(Punctuator.RBRACE) && !this._matchType(TokenType.EOF)) {
      this._consumeType(TokenType.EOL);
    }
  }

  _peek (distance = 0) {
    return this._lexer.peek(distance);
  }

  _match (expectedValue) {
    const token = this._peek();

    return token && token.value === expectedValue;
  }

  _consume (expectedValue) {
    if (expectedValue) {
      const token = this._peek();

      if (!token || token.value !== expectedValue) {
        const [ lineNo, columnNo ] = this._lexer.getCurrentPosition();
        const tokenValue = this._resolveTokenValue(token);

        throw new SyntaxError(`Expected next token to be "${expectedValue}", got "${tokenValue}" instead (@${lineNo}:${columnNo}).`);
      }
    }

    return this._lexer.nextToken();
  }

  _matchType (expectedType) {
    const token = this._peek();

    return token && token.type === expectedType;
  }

  _consumeType (expectedType) {
    if (expectedType) {
      const token = this._peek();

      if (!token || token.type !== expectedType) {
        const [ lineNo, columnNo ] = this._lexer.getCurrentPosition();
        const tokenValue = this._resolveTokenValue(token);

        throw new SyntaxError(`Expected next token to be "${expectedType}", got "${tokenValue}" instead (@${lineNo}:${columnNo}).`);
      }
    }

    return this._lexer.nextToken();
  }

  _consumeOptionalEOL () {
    if (this._matchType(TokenType.EOL)) {
      this._consume();
    }
  }

  _resolveTokenValue (token) {
    let { value } = token;

    if (token.type === TokenType.EOF) {
      value = '<end of file>';
    }
    else if (token.type === TokenType.EOL) {
      value = '<end of line>';
    }

    return value;
  }

  _registerPrefixParser (value, parserFn) {
    this._prefixParsers[value] = parserFn;
  }

  _registerInfixParser (value, parserFn) {
    this._infixParsers[value] = parserFn;
  }

  _registerStatement (value, parserFn) {
    this._statementParsers[value] = parserFn;
  }

  _getPrefixParser (token) {
    return this._prefixParsers[token.type] || this._prefixParsers[token.value];
  }

  _getInfixParser (token) {
    return this._infixParsers[token.type] || this._infixParsers[token.value];
  }

  _getStatementParser (token) {
    return this._statementParsers[token.value];
  }

  _getPeekPrecendence () {
    return TokenPrecedence[this._peek().value] || Precedence.LOWEST;
  }
}

export default Parser;
