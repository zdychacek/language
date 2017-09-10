import * as object from '../object';
import * as consts from '../constants';

const { ObjectType } = object;

// Convert an argument to number value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;
  const argType = arg.getType();

  if (argType === ObjectType.NUMBER_OBJ) {
    return arg;
  }

  if (argType === ObjectType.STRING_OBJ) {
    const parsedNum = Number.parseFloat(arg.value);

    if (!Number.isNaN(parsedNum) && isFinite(arg.value)) {
      return new object.NumberObject(parsedNum);
    }
    else {
      return consts.NULL;
    }
  }

  if (argType === ObjectType.BOOLEAN_OBJ) {
    if (arg === consts.TRUE) {
      return new object.NumberObject(1);
    }
    else if (arg === consts.FALSE) {
      return new object.NumberObject(0);
    }
  }

  if (argType === ObjectType.NULL_OBJ || argType === ObjectType.VOID_OBJ) {
    return new object.NumberObject(0);
  }

  return consts.NULL;
});
