import * as object from '../object';
import * as consts from '../constants';

// Convert an argument to boolean value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;

  if (arg instanceof object.BooleanObject) {
    return arg;
  }

  if (arg instanceof object.NullObject) {
    return consts.FALSE;
  }

  if (arg instanceof object.StringObject) {
    if (!arg.value.length) {
      return consts.FALSE;
    }
    else {
      return consts.TRUE;
    }
  }

  if (arg instanceof object.NumberObject) {
    if (!arg.value) {
      return consts.FALSE;
    }
    else {
      return consts.TRUE;
    }
  }

  return consts.NULL;
});
