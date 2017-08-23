export const ObjectType = {
  NUMBER_OBJ: 'NUMBER',
  BOOLEAN_OBJ: 'BOOLEAN',
  STRING_OBJ: 'STRING',
  NULL_OBJ: 'NULL',
  RETURN_VALUE_OBJ: 'RETURN_VALUE',
  VOID_OBJ: 'VOID',
  ERROR_OBJ: 'ERROR',
  FUNCTION_OBJ: 'FUNCTION',
  BUILTIN_OBJ: 'BUILTIN',
  ARRAY_OBJ: 'ARRAY',
};

export class ObjectValue {
  constructor (value) {
    this.value = value;
  }

  getType () {
    throw new Error('Not implemented.');
  }

  $inspect () {
    if (this.value !== undefined) {
      return this.value.toString();
    }

    return '';
  }
}

export class NumberObject extends ObjectValue {
  getType () {
    return ObjectType.NUMBER_OBJ;
  }
}

export class BooleanObject extends ObjectValue {
  getType () {
    return ObjectType.BOOLEAN_OBJ;
  }
}

export class StringObject extends ObjectValue {
  getType () {
    return ObjectType.STRING_OBJ;
  }

  $inspect () {
    return `"${this.value.toString()}"`;
  }
}

export class NullObject extends ObjectValue {
  constructor () {
    super('null');
  }

  getType () {
    return ObjectType.NULL_OBJ;
  }
}

export class ReturnValueObject extends ObjectValue {
  getType () {
    return ObjectType.RETURN_VALUE_OBJ;
  }
}

export class VoidObject extends ObjectValue {
  constructor () {
    super('<void>');
  }

  getType () {
    return ObjectType.VOID_OBJ;
  }
}

export class ErrorObject extends ObjectValue {
  getType () {
    return ObjectType.ERROR_OBJ;
  }

  $inspect () {
    return `ERROR: ${this.value}`;
  }
}

export class FunctionObject extends ObjectValue {
  constructor (parameters, body, env) {
    super();

    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  getType () {
    return ObjectType.FUNCTION_OBJ;
  }

  $inspect () {
    const params = this.parameters
      .map((param) => param.toString())
      .join(', ');

    return `(${params}) -> ${this.body.toString()}`;
  }
}

export class BuiltinObject extends ObjectValue {
  getType () {
    return ObjectType.BUILTIN_OBJ;
  }

  $inspect () {
    return '<builtin function>';
  }
}

export class ArrayObject extends ObjectValue {
  constructor (elements) {
    super();

    this.elements = elements;
  }

  getType () {
    return ObjectType.ARRAY_OBJ;
  }

  $inspect () {
    const elements = this.elements
      .map((el) => el.$inspect())
      .join(', ');

    return `[${elements}]`;
  }
}
