/* eslint-disable max-params */

class Node {
  token = null;

  constructor (token) {
    this.token = token;
  }

  getTokenValue () {
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

  getTokenValue () {
    if (this.statements.length) {
      return this.statements[0].getTokenValue();
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
    let out = `${this.getTokenValue()} `;

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
    let out = `${this.getTokenValue()} `;

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

export class EmptyStatement extends Statement {
  toString () {
    return ';';
  }
}
export class Literal extends Expression {
  constructor (token, literal) {
    super(token);

    this.literal = literal;
  }

  toString () {
    return this.literal.toString();
  }
}

export class NumberLiteral extends Literal {}

export class BooleanLiteral extends Literal {}

export class IfExpression extends Expression {
  constructor (token, condition, consequence, alternative) {
    super(token);

    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  toString () {
    let out = `if ${this.condition.toString()} `;

    out += this.consequence.toString();

    if (this.alternative) {
      out += `else ${this.alternative.toString()}`;
    }

    return out;
  }
}

export class BlockStatement extends Statement {
  constructor (token, statements) {
    super(token);

    this.statements = statements;
  }

  toString () {
    return this.statements
      .map((stmt) => stmt.toString())
      .join('');
  }
}
