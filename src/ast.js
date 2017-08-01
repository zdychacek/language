class Node {
  token = null;

  constructor (token) {
    this.token = token;
  }

  tokenLiteral () {
    return this.token.literal;
  }
}

export class Statement extends Node {}

export class Expression extends Node {}

export class Program extends Node {
  _statements = [];

  constructor () {
    super();
  }

  tokenLiteral () {
    if (this._statements.length) {
      return this._statements[0].tokenLiteral();
    }
    else {
      return '';
    }
  }
}

export class LetStatement extends Statement {
  identifier = null;
  expression = null;
}

export class Identifier extends Expression {
  value = '';

  constructor (token, value) {
    super(token);

    this.value = value;
  }
}
