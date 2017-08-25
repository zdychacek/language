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

// just a placeholder for empty param list
export class EmptyParamListPlaceholder extends Node {}

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

    return out;
  }
}

export class ReturnStatement extends Statement {
  constructor (token, returnValue) {
    super(token);

    this.returnValue = returnValue;
  }

  toString () {
    let out = this.getTokenValue();

    if (this.returnValue) {
      out += ` ${this.returnValue.toString()}`;
    }

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
      return `${this.expression.toString()}`;
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

export class AssignmentExpression extends InfixExpression {}

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

export class StringLiteral extends Literal {}

export class NullLiteral extends Literal {
  constructor (token) {
    super(token, 'null');
  }
}

export class ArrayLiteral extends Literal {
  constructor (token, elements) {
    super(token, null);

    this.elements = elements;
  }

  toString () {
    const elements = this.elements
      .map((el) => el.toString())
      .join(', ');

    return `[${elements}]`;
  }
}

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
      out += ` else ${this.alternative.toString()}`;
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
    if (this.statements.length) {
      return `{ ${this.statements
        .map((stmt) => stmt.toString())
        .join('')} }`;
    }

    return '{}';
  }
}

export class FunctionLiteral extends Expression {
  constructor (token, parameters, body) {
    super(token);

    this.parameters = parameters;
    this.body = body;
  }

  toString () {
    const parameters = `(${this.parameters.join(', ')})`;

    return `${parameters} -> ${this.body.toString()}`;
  }
}

export class CallExpression extends Expression {
  constructor (token, fn, args) {
    super(token);

    this.fn = fn;
    this.arguments = args;
  }

  toString () {
    const args = this.arguments.map((arg) => arg.toString()).join(', ');

    return `${this.fn.toString()}(${args})`;
  }
}

export class SequenceExpression extends Expression {
  constructor (token, expressions) {
    super(token);

    this.expressions = expressions;
  }

  toString () {
    return this.expressions
      .map((exp) => exp.toString())
      .join(', ');
  }
}

export class IndexExpression extends Expression {
  constructor (token, left, index) {
    super(token);

    this.left = left;
    this.index = index;
  }

  toString () {
    return `(${this.left.toString()}[${this.index.toString()}])`;
  }
}

export class ImportStatement extends Statement {
  constructor (token, specifier, source) {
    super(token);

    this.specifier = specifier;
    this.source = source;
  }

  toString () {
    return `${this.getTokenValue()} ${this.specifier} from "${this.source}"`;
  }
}
