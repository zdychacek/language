class Node {
  token = null;

  constructor (token) {
    this.token = token;
  }

  tokenValue () {
    return this.token.value;
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

  tokenValue () {
    if (this.statements.length) {
      return this.statements[0].tokenValue();
    }
    else {
      return '';
    }
  }

  toString () {
    return this.statements
      .map((stmt) => stmt.toString())
      .join('');
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
    let out = `${this.tokenValue()} `;

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
    let out = `${this.tokenValue()} `;

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

export class NumberLiteral extends Expression {
  constructor (token, literal) {
    super(token);

    this.literal = literal;
  }

  toString () {
    return this.literal;
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
  constructor (token, left, operator, right) { // eslint-disable-line max-params
    super(token);

    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  toString () {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
  }
}

export class EmptyStatement extends Statement {
  toString () {
    return ';';
  }
}
