import * as object from '../object';
import * as consts from '../constants';

const { ObjectType } = object;

// Convert an argument to boolean value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;
  const argType = arg.getType();

  if (argType === ObjectType.BOOLEAN_OBJ) {
    return arg;
  }

  if (argType === ObjectType.NULL_OBJ || argType === ObjectType.VOID_OBJ) {
    return consts.FALSE;
  }

  if (argType === ObjectType.STRING_OBJ) {
    if (!arg.value.length) {
      return consts.FALSE;
    }
    else {
      return consts.TRUE;
    }
  }

  if (argType === ObjectType.NUMBER_OBJ) {
    if (!arg.value) {
      return consts.FALSE;
    }
    else {
      return consts.TRUE;
    }
  }

  return consts.NULL;
});
