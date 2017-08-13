export const ObjectType = {
  NUMBER_OBJ: 'NUMBER',
  BOOLEAN_OBJ: 'BOOLEAN',
  NULL_OBJ: 'NULL',
  RETURN_VALUE_OBJ: 'RETURN_VALUE',
  VOID_OBJ: 'VOID',
  ERROR_OBJ: 'ERROR',
};

export class ObjectValue {
  constructor (value) {
    this.value = value;
  }

  getType () {
    throw new Error('Not implemented.');
  }

  $inspect () {
    return this.value.toString();
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
