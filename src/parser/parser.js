import {
  TokenType,
  Precedence,
  TokenPrecedence,
  Keyword,
  Punctuator,
  BooleanLiteral,
} from '../lexer/token';
import * as ast from './ast';
import { NUMERIC_SEPARATOR } from '../lexer/constants';
import { is } from '../utils';

class Parser {
  // Lexer reference
  _lexer = null;
  // file name we are parsing
  _fileName = '';
  // map of prefix parsers, eg. `-1`
  _prefixParsers = {};
  // map of infix parsers, eg. `1 + 2`
  _infixParsers = {};
  // map of statement parsers, eg. `if`
  _statementParsers = {};

  constructor (lexer) {
    this._lexer = lexer;

    this._fileName = lexer._fileName;

    // prefix parsers
    this._registerPrefixParser(TokenType.IDENT, this._parseIdentifier);
    this._registerPrefixParser(TokenType.NUMBER, this._parseNumberLiteral);
    this._registerPrefixParser(TokenType.BOOLEAN, this._parseBooleanLiteral);
    this._registerPrefixParser(TokenType.NULL, this._parseNullLiteral);
    this._registerPrefixParser(TokenType.VOID, this._parseVoidLiteral);
    this._registerPrefixParser(TokenType.STRING, this._parseStringLiteral);
    this._registerPrefixParser(Punctuator.BANG, this._parsePrefixExpression);
    this._registerPrefixParser(Punctuator.MINUS, this._parsePrefixExpression);
    this._registerPrefixParser(Punctuator.LPAREN, this._parseEmptyParamListOrGroupedExpression);
    this._registerPrefixParser(Keyword.IF, this._parseIfExpression);
    this._registerPrefixParser(Punctuator.LBRACKET, this._parseArrayLiteral);
    this._registerPrefixParser(Punctuator.LBRACE, this._parseObjectLiteral);

    // infix parsers
    this._registerInfixParser(Punctuator.PLUS, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.MINUS, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.SLASH, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.ASTERISK, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.EQ, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.NOT_EQ, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.LT, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.GT, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.DOUBLE_AMPERSAND, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.DOUBLE_PIPE, this._parseInfixExpression);
    this._registerInfixParser(Punctuator.LPAREN, this._parseCallExpression(Punctuator.LPAREN));
    this._registerInfixParser(Punctuator.QUESTIONMARK_LPAREN, this._parseCallExpression(Punctuator.QUESTIONMARK_LPAREN));
    this._registerInfixParser(Punctuator.COMMA, this._parseSequenceExpression);
    this._registerInfixParser(Punctuator.DASH_ARROW, this._parseFunctionLiteral);
    this._registerInfixParser(Punctuator.ASSIGN, this._parseAssignmentExpression);
    this._registerInfixParser(Punctuator.LBRACKET, this._parseMemberExpression(Punctuator.LBRACKET));
    this._registerInfixParser(Punctuator.DOT, this._parseMemberExpression(Punctuator.DOT));
    this._registerInfixParser(Punctuator.QUESTIONMARK_DOT, this._parseMemberExpression(Punctuator.QUESTIONMARK_DOT));

    // statements
    this._registerStatement(Keyword.LET, this._parseLetStatement);
    this._registerStatement(Keyword.RETURN, this._parseReturnStatement);
    this._registerStatement(Punctuator.LBRACE, this._parseBlockStatement);
    this._registerStatement(Keyword.IMPORT, this._parseImportStatement);
    this._registerStatement(Keyword.EXPORT, this._parseExportStatement);
    this._registerStatement(Keyword.FOR, this._parseForStatement);
    this._registerStatement(Keyword.BREAK, this._parseBreakStatement);
    this._registerStatement(Keyword.CONTINUE, this._parseContinueStatement);
  }

  parseProgram = () => {
    const statements = [];

    while (!this._matchType(TokenType.EOF)) {
      this._doParseStatement(statements);
    }

    return new ast.Program(this._lexer.getFileName(), statements);
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

  _parseImportStatement = () => {
    const token = this._consume(Keyword.IMPORT);

    const source = this._parseStringLiteral();
    let alias = null;

    // aliased import
    if (this._match(Keyword.AS)) {
      this._consume(Keyword.AS);

      alias = this._parseIdentifier();
    }

    return new ast.ImportStatement(token, alias, source);
  }

  _parseExportStatement = () => {
    const token = this._consume(Keyword.EXPORT);

    let alias = null;
    let value = null;

    // export variable or function declaration
    if (this._match(Keyword.LET)) {
      value = this._parseLetStatement();
    }
    // export any expression
    else {
      value = this._parseExpression();

      // if we are exporting an identifier, then export alias is not required
      if (is(value, ast.Identifier)) {
        if (this._match(Keyword.AS)) {
          this._consume();

          alias = this._parseIdentifier();
        }
      }
      // if declaration is anything else than an `ast.Identifier`, we have to specify export alias
      else {
        this._consume(Keyword.AS);

        alias = this._parseIdentifier();
      }
    }

    return new ast.ExportStatement(token, alias, value);
  }

  _parseForStatement = () => {
    const forStmt = new ast.ForStatement(this._consume(Keyword.FOR));

    forStmt.condition = this._parseExpression();
    forStmt.body = this._parseBlockStatement();

    return forStmt;
  }

  _parseBreakStatement = () => {
    return new ast.BreakStatement(this._consume(Keyword.BREAK));
  }

  _parseContinueStatement = () => {
    return new ast.ContinueStatement(this._consume(Keyword.BREAK));
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
      throw new SyntaxError(`Unexpected end of file (${this._lexer.getFileName()}).`);
    }

    const prefix = this._getPrefixParser(token);

    if (!prefix) {
      const [ lineNo, columnNo ] = this._lexer.getCurrentPosition();

      throw new SyntaxError(`Unexpected token "${this._resolveTokenValue(token)}" (${this._lexer.getFileName()}@${lineNo}:${columnNo}).`);
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
    const cleanValue = token.value.replace(new RegExp(NUMERIC_SEPARATOR, 'g'), '');

    if (isNaN(Number(cleanValue))) {
      const [ lineNo, columnNo ] = token.start;

      throw new SyntaxError(`Could not parse ${token.value} as a number (${this._lexer.getFileName()}@${lineNo}:${columnNo}).`);
    }

    return new ast.NumberLiteral(token, Number.parseFloat(cleanValue));
  }

  _parseBooleanLiteral = () => {
    const token = this._consumeType(TokenType.BOOLEAN);

    return new ast.BooleanLiteral(token, token.value === BooleanLiteral.TRUE);
  }

  _parseNullLiteral = () => {
    return new ast.NullLiteral(this._consumeType(TokenType.NULL));
  }

  _parseVoidLiteral = () => {
    return new ast.VoidLiteral(this._consumeType(TokenType.VOID));
  }

  _parseIfExpression = () => {
    const token = this._consume(Keyword.IF);
    const condition = this._parseExpression();
    let consequence = null;

    // `if a > b: <exp>`
    if (this._match(Punctuator.COLON)) {
      this._consume();
      this._consumeOptionalEOL();

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

  // fn() or fn?()
  _parseCallExpression = (punctuator) => (left) => {
    const token = this._consume(punctuator);
    const args = [];

    while (!this._match(Punctuator.RPAREN)) {
      this._consumeOptionalEOL();

      args.push(this._parseExpression(Precedence.SEQUENCE));

      if (!this._match(Punctuator.COMMA)) {
        break;
      }

      this._consume(Punctuator.COMMA);
    }

    this._consumeOptionalEOL();
    this._consume(Punctuator.RPAREN);

    const isOptional = punctuator === Punctuator.QUESTIONMARK_LPAREN;

    return new ast.CallExpression(token, left, args, isOptional);
  }

  _parsePrefixExpression = () => {
    const token = this._consume();
    const expression = new ast.PrefixExpression(token, token.value);

    expression.right = this._parseExpression(Precedence.PREFIX);

    return expression;
  }

  _parseAssignmentExpression = (left) => {
    const token = this._consume();

    this._consumeOptionalEOL();

    const expression = new ast.AssignmentExpression(token, left, token.value);

    if (!is(left, ast.Identifier) && !is(left, ast.MemberExpression)) {
      const [ lineNo, columnNo ] = this._lexer.getCurrentPosition();

      throw new SyntaxError(`The left-hand side of an assignment must be an identifier or a member expression (${this._lexer.getFileName()}@${lineNo}:${columnNo}).`);
    }

    expression.right = this._parseExpression(Precedence.ASSIGN - 1);

    return expression;
  }

  _parseInfixExpression = (left) => {
    const token = this._consume();

    return new ast.InfixExpression(
      token,
      left,
      token.value,
      this._parseExpression(TokenPrecedence[token.value])
    );
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

    if (is(left, ast.Identifier)) {
      params.push(left);
    }
    // we get multiple parameters as a `SequenceExpression,`
    // so we have to map this expression to identifiers or throw an error
    else if (is(left, ast.SequenceExpression)) {
      left.expressions.forEach((exp) => {
        if (is(exp, ast.Identifier)) {
          params.push(exp);
        }
        else {
          const { start } = exp.token;

          throw new SyntaxError(`Function argument must be an identifier, got "${exp.toString()}" (${this._lexer.getFileName()}@${start.join(':')}).`);
        }
      });
    }
    // throw if we get anything else except `EmptyParamListPlaceholder`
    else if (!is(left, ast.EmptyParamListPlaceholder)) {
      const { start } = left.token;

      throw new SyntaxError(`Function argument must be an identifier, got "${left.toString()}" (${this._lexer.getFileName()}@${start.join(':')}).`);
    }

    const body = this._parseExpressionOrBlockStatement();

    return new ast.FunctionLiteral(token, params, body);
  }

  _parseStringLiteral = () => {
    const token = this._consumeType(TokenType.STRING);

    return new ast.StringLiteral(token, token.value);
  }

  _parseArrayLiteral = () => {
    const token = this._consume(Punctuator.LBRACKET);

    this._consumeOptionalEOL();

    const elements = [];

    if (!this._match(Punctuator.RBRACKET)) {
      elements.push(this._parseExpression(Precedence.SEQUENCE));

      while (this._match(Punctuator.COMMA)) {
        this._consume(Punctuator.COMMA);
        this._consumeOptionalEOL();
        elements.push(this._parseExpression(Precedence.SEQUENCE));
      }
    }

    this._consumeOptionalEOL();
    this._consume(Punctuator.RBRACKET);

    return new ast.ArrayLiteral(token, elements);
  }

  _parseObjectLiteralProperty (objectLiteral) {
    const property = new ast.ObjectLiteralProperty();

    property.computed = false;

    // computed
    if (this._match(Punctuator.LBRACKET)) {
      this._consume();

      property.key = this._parseExpression();
      property.computed = true;

      this._consume(Punctuator.RBRACKET);
    }
    else if (this._matchType(TokenType.STRING)) {
      property.key = this._parseStringLiteral();
    }
    else if (this._matchType(TokenType.NUMBER)) {
      property.key = this._parseNumberLiteral();
    }
    else {
      property.key = this._parseIdentifier();
    }

    this._consume(Punctuator.COLON);

    property.value = this._parseExpression(Precedence.SEQUENCE);

    objectLiteral.properties.set(property.key, property);
  }

  _parseObjectLiteral = () => {
    const token = this._consume(Punctuator.LBRACE);
    const objectLiteral = new ast.ObjectLiteral(token);

    objectLiteral.properties = new Map();

    this._consumeOptionalEOL();

    if (!this._match(Punctuator.RBRACE)) {
      this._parseObjectLiteralProperty(objectLiteral);

      while (this._match(Punctuator.COMMA)) {
        this._consume(Punctuator.COMMA);
        this._consumeOptionalEOL();

        this._parseObjectLiteralProperty(objectLiteral);
      }
    }

    this._consumeOptionalEOL();
    this._consume(Punctuator.RBRACE);

    return objectLiteral;
  }

  _parseMemberExpression = (punctuator) => (left) => {
    const memberExpression = new ast.MemberExpression(this._consume(punctuator), left);

    memberExpression.optional = false;
    memberExpression.computed = false;

    // [prop] variant
    if (punctuator === Punctuator.LBRACKET) {
      memberExpression.computed = true;
      memberExpression.index = this._parseExpression(Precedence.SEQUENCE);
      this._consume(Punctuator.RBRACKET);
    }
    // .prop variant
    else if (punctuator === Punctuator.DOT) {
      memberExpression.index = this._parseIdentifier();
    }
    else if (punctuator === Punctuator.QUESTIONMARK_DOT) {
      return this._parseOptionalMemberExpression(memberExpression);
    }

    return memberExpression;
  }

  _parseOptionalMemberExpression (memberExpression) {
    memberExpression.optional = true;

    // .?[prop] variant
    if (this._match(Punctuator.LBRACKET)) {
      this._consume(Punctuator.LBRACKET);

      memberExpression.computed = true;
      memberExpression.index = this._parseExpression(Precedence.SEQUENCE);

      this._consume(Punctuator.RBRACKET);
    }
    // ?.prop variant
    else {
      memberExpression.index = this._parseIdentifier();
    }

    return memberExpression;
  }

  _parseExpressionOrBlockStatement () {
    if (this._match(Punctuator.LBRACE)) {
      return this._parseBlockStatement();
    }
    else {
      this._consumeOptionalEOL();

      return this._parseExpression(Precedence.SEQUENCE);
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

        throw new SyntaxError(`Expected next token to be "${expectedValue}", got "${tokenValue}" instead (${this._lexer.getFileName()}@${lineNo}:${columnNo}).`);
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

        throw new SyntaxError(`Expected next token to be "${expectedType}", got "${tokenValue}" instead (${this._lexer.getFileName()}@${lineNo}:${columnNo}).`);
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
