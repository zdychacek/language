import * as object from '../object';
import * as consts from '../constants';

const { ObjectType } = object;

// Convert an argument to string value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;
  const argType = arg.getType();

  if (argType === ObjectType.STRING_OBJ) {
    return arg;
  }

  switch (argType) {
    case ObjectType.NUMBER_OBJ:
    case ObjectType.BOOLEAN_OBJ:
    case ObjectType.FUNCTION_OBJ:
    case ObjectType.NULL_OBJ:
    case ObjectType.VOID_OBJ:
      return new object.StringObject(arg.toString());
  }

  return consts.NULL;
});
