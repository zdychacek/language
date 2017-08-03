class Node {
  token = null;

  constructor (token) {
    this.token = token;
  }

  tokenLiteral () {
    return this.token.literal;
  }

  toString () {
    return '<abstract Node>';
  }
}

export class Statement extends Node {}

export class Expression extends Node {}

export class Program extends Node {
  constructor (statements) {
    super();

    this.statements = statements;
  }

  tokenLiteral () {
    if (this.statements.length) {
      return this.statements[0].tokenLiteral();
    }
    else {
      return '';
    }
  }

  toString () {
    return this.statements
      .map((stmt) => stmt.toString())
      .join('\n');
  }
}

export class Identifier extends Expression {
  constructor (token, value) {
    super(token);

    this.value = value;
  }

  toString () {
    return this.value;
  }
}

export class LetStatement extends Statement {
  constructor (token, name, expression) {
    super(token);

    this.name = name;
    this.expression = expression;
  }

  toString () {
    let out = `${this.tokenLiteral()} `;

    out += this.name.toString();
    out += ' = ';

    if (this.expression) {
      out += this.expression.toString();
    }

    out += ';';

    return out;
  }
}

export class ReturnStatement extends Statement {
  constructor (token, returnValue) {
    super(token);

    this.returnValue = returnValue;
  }

  toString () {
    let out = `${this.tokenLiteral()} `;

    if (this.returnValue) {
      out += this.returnValue.toString();
    }

    out += ';';

    return out;
  }
}

export class ExpressionStatement extends Statement {
  constructor (token, returnValue) {
    super(token);

    this.expression = returnValue;
  }

  toString () {
    if (this.expression) {
      return this.expression.toString();
    }

    return '';
  }
}

export class IntegerLiteral extends Expression {
  constructor (token, value) {
    super(token);

    this.value = value;
  }

  toString () {
    return this.token.literal;
  }
}

export class PrefixExpression extends Expression {
  constructor (token, operator, right) {
    super(token);

    this.operator = operator;
    this.right = right;
  }

  toString () {
    return `(${this.operator}${this.right.toString()})`;
  }
}

export class InfixExpression extends Expression {
  constructor (token, left, operator, right) {
    super(token);

    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  toString () {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
  }
}
