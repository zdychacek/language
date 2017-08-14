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
    this._registerPrefixParser(TokenType.IDENT, this._parseIdentifier);
    this._registerPrefixParser(TokenType.NUMBER, this._parseNumberLiteral);
    this._registerPrefixParser(TokenType.BOOLEAN, this._parseBooleanLiteral);
    this._registerPrefixParser(Punctuator.BANG, this._parsePrefixExpression);
    this._registerPrefixParser(Punctuator.MINUS, this._parsePrefixExpression);
    this._registerPrefixParser(Punctuator.LPAREN, this._parseEmptyParamListOrGroupedExpression);
    this._registerPrefixParser(Keyword.IF, this._parseIfExpression);

    // infix parsers
    this._registerInfixParser(Punctuator.PLUS, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.MINUS, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.SLASH, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.ASTERISK, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.ASSIGN, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.EQ, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.NOT_EQ, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.LT, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.GT, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.LPAREN, this._parseCallExpression);
    this._registerInfixParser(Punctuator.COMMA, this._parseSequenceExpression);
    this._registerInfixParser(Punctuator.DASH_ARROW, this._parseFunctionLiteral);

    // statements
    this._registerStatement(Keyword.LET, this._parseLetStatement);
    this._registerStatement(Keyword.RETURN, this._parseReturnStatement);
    this._registerStatement(Punctuator.LBRACE, this._parseBlockStatement);
  }

  parseProgram = () => {
    const program = new ast.Program();

    program.statements = [];

    while (!this._matchType(TokenType.EOF)) {
      this._doParseStatement(program.statements);
    }

    return program;
  }

  _parseStatement = () => {
    const statementParser = this._getStatementParser(this._peek());

    if (statementParser) {
      return statementParser(this);
    }
    else {
      return this._parseExpressionStatement();
    }
  }

  _parseLetStatement = () => {
    let token = this._consume(Keyword.LET);

    const stmt = new ast.LetStatement(token);

    token = this._consumeType(TokenType.IDENT);

    stmt.name = new ast.Identifier(token, token.value);

    this._consume(Punctuator.ASSIGN);

    stmt.expression = this._parseExpression();

    return stmt;
  }

  _parseReturnStatement = () => {
    const stmt = new ast.ReturnStatement(this._consume(Keyword.RETURN));

    if (!this._matchType(TokenType.EOL) && !this._matchType(TokenType.EOF)) {
      stmt.returnValue = this._parseExpression();
    }

    return stmt;
  }

  _parseExpressionStatement = () => {
    return new ast.ExpressionStatement(this._peek(), this._parseExpression());
  }

  _parseExpression = (precedence = Precedence.LOWEST) => {
    let token = this._peek();

    if (this._matchType(TokenType.EOF)) {
      throw new SyntaxError('Unexpected end of file.');
    }

    const prefix = this._getPrefixParser(token);

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

  _parseIdentifier = () => {
    const token = this._consumeType(TokenType.IDENT);

    return new ast.Identifier(token, token.value);
  }

  _parseNumberLiteral = () => {
    const token = this._consumeType(TokenType.NUMBER);
    const value = Number.parseInt(token.value, 10);

    if (!Number.isInteger(value)) {
      throw new SyntaxError(`Could not parse ${token.value} as integer.`);
    }

    return new ast.NumberLiteral(token, value);
  }

  _parseBooleanLiteral = () => {
    const token = this._consumeType(TokenType.BOOLEAN);

    return new ast.BooleanLiteral(token, token.value === BooleanLiteral.TRUE);
  }

  _parseIfExpression = () => {
    const token = this._consume(Keyword.IF);
    const condition = this._parseExpression();
    let consequence = null;

    // `if a > b: <exp>`
    if (this._match(Punctuator.COLON)) {
      this._consume();

      consequence = this._parseExpression();
    }
    // `if a > b { <exp> }`
    else {
      consequence = this._parseBlockStatement();
    }

    if (this._match(Keyword.ELSE, this._peek(1))) {
      this._consumeOptionalEOL();
    }

    let alternative = null;

    if (this._match(Keyword.ELSE)) {
      this._consume();

      alternative = this._parseExpressionOrBlockStatement();
    }

    return new ast.IfExpression(token, condition, consequence, alternative);
  }

  _parseBlockStatement = () => {
    const token = this._consume(Punctuator.LBRACE);
    const statements = [];

    while (!this._match(Punctuator.RBRACE) && !this._matchType(TokenType.EOF)) {
      this._doParseStatement(statements);
    }

    this._consume(Punctuator.RBRACE);

    return new ast.BlockStatement(token, statements);
  }

  _parseCallExpression = (left) => {
    const token = this._consume(Punctuator.LPAREN);
    const args = [];

    while (!this._match(Punctuator.RPAREN)) {
      args.push(this._parseExpression(Precedence.SEQUENCE));

      if (!this._match(Punctuator.COMMA)) {
        break;
      }

      this._consume(Punctuator.COMMA);
    }

    this._consume(Punctuator.RPAREN);

    return new ast.CallExpression(token, left, args);
  }

  _parsePrefixExpression = () => {
    const token = this._consume();
    const expression = new ast.PrefixExpression(token, token.value);

    expression.right = this._parseExpression(Precedence.PREFIX);

    return expression;
  }

  _parseInfixExpression = (left) => {
    const token = this._consume();
    const expression = new ast.InfixExpression(token, left, token.value);

    expression.right = this._parseExpression(TokenPrecedence[token.value]);

    return expression;
  }

  _parseSequenceExpression = (left) => {
    const token = this._consume(Punctuator.COMMA);
    const expressions = [ left ];

    while (!this._match(Punctuator.COMMA)) {
      expressions.push(this._parseExpression(Precedence.SEQUENCE));

      if (!this._match(Punctuator.COMMA)) {
        break;
      }

      this._consume(Punctuator.COMMA);
    }

    return new ast.SequenceExpression(token, expressions);
  }

  _parseEmptyParamListOrGroupedExpression = () => {
    const token = this._consume(Punctuator.LPAREN);

    if (
      this._match(Punctuator.RPAREN, this._peek()) &&
      this._match(Punctuator.DASH_ARROW, this._peek(1))
    ) {
      this._consume();

      return new ast.EmptyParamListPlaceholder(token);
    }
    else {
      const expression = this._parseExpression();

      this._consume(Punctuator.RPAREN);

      return expression;
    }
  }

  _parseFunctionLiteral = (left) => {
    const token = this._consume(Punctuator.DASH_ARROW);
    const params = [];

    if (left instanceof ast.Identifier) {
      params.push(left);
    }
    // we get multiple parameters as a `SequenceExpression,`
    // so we have to map this expression to identifiers or throw an error
    else if (left instanceof ast.SequenceExpression) {
      left.expressions.forEach((exp) => {
        if (exp instanceof ast.Identifier) {
          params.push(exp);
        }
        else {
          const { start } = exp.token;

          throw new SyntaxError(`Function argument must be an identifier, got "${exp.toString()}" (@${start.join(':')}).`);
        }
      });
    }
    // throw if we get anything else except `EmptyParamListPlaceholder`
    else if (!(left instanceof ast.EmptyParamListPlaceholder)) {
      const { start } = left.token;

      throw new SyntaxError(`Function argument must be an identifier, got "${left.toString()}" (@${start.join(':')}).`);
    }

    const body = this._parseExpressionOrBlockStatement();

    return new ast.FunctionLiteral(token, params, body);
  }

  _parseExpressionOrBlockStatement () {
    if (this._match(Punctuator.LBRACE)) {
      return this._parseBlockStatement();
    }
    else {
      return this._parseExpression();
    }
  }

  _doParseStatement (statements) {
    this._consumeOptionalEOL();

    const stmt = this._parseStatement();

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

  _match (expectedValue, token = this._peek()) {
    return token && token.value === expectedValue;
  }

  _matchType (expectedType, token = this._peek()) {
    return token && token.type === expectedType;
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
