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
  MODULE_OBJ: 'MODULE',
  OBJECT_OBJ: 'OBJECT',
};

export class ObjectValue {
  constructor (value) {
    this.value = value;
  }

  getType () {
    throw new Error('Not implemented.');
  }

  toString () {
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

  getHashKey () {
    return this.value.toString();
  }
}

export class BooleanObject extends ObjectValue {
  getType () {
    return ObjectType.BOOLEAN_OBJ;
  }

  getHashKey () {
    if (this.value) {
      return '1';
    }

    return '0';
  }
}

export class StringObject extends ObjectValue {
  getType () {
    return ObjectType.STRING_OBJ;
  }

  toString () {
    return `"${this.value.toString()}"`;
  }

  getHashKey () {
    return this.value.toString();
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

  toString () {
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

  toShortString () {
    const params = this.parameters
      .map((param) => param.toString())
      .join(', ');

    return `(${params}) -> { ... }`;
  }

  toString () {
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

  toString () {
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

  toString () {
    const elements = this.elements
      .map((el) => el.toString())
      .join(', ');

    return `[${elements}]`;
  }
}

export class ModuleObject extends ObjectValue {
  constructor (name, bindings) {
    super();

    this.name = name;
    this.bindings = bindings;
  }

  getType () {
    return ObjectType.MODULE_OBJ;
  }

  toString () {
    const bindings = Object.entries(this.bindings)
      .map(([ name, binding ]) => {
        const bindingValue = binding instanceof FunctionObject ?
          binding.toShortString() : binding.toString();

        return `  ${name}: ${bindingValue}`;
      })
      .join(',\n');

    return `<Module: "${this.name}"> ${bindings.length ? `{\n${bindings}\n}` : '{}'}`;
  }
}

export class ObjectObject extends ObjectValue {
  constructor (pairs) {
    super();

    this.pairs = pairs;
  }

  getType () {
    return ObjectType.OBJECT_OBJ;
  }

  toString () {
    const pairs = Array.from(this.pairs)
      .map(([ , { key, value } ]) => `  ${key.toString()}: ${value.toString()}`)
      .join(',\n');

    if (pairs) {
      return `{\n${pairs}\n}`;
    }

    return '{}';
  }
}
