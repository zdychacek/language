export const ObjectType = {
  NUMBER_OBJ: 'NUMBER',
  BOOLEAN_OBJ: 'BOOLEAN',
  NULL_OBJ: 'NULL',

};

export class ObjectValue {
  constructor (value) {
    this.value = value;
  }

  getType () {
    return '<abstract ObjectType>';
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
  $inspect () {
    return 'null';
  }

  getType () {
    return ObjectType.NULL_OBJ;
  }
}

