import * as object from '../object';
import * as consts from '../constants';

// Convert an argument to number value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;

  if (arg instanceof object.NumberObject) {
    return arg;
  }

  if (arg instanceof object.StringObject) {
    const parsedNum = Number.parseFloat(arg.value);

    if (!Number.isNaN(parsedNum) && isFinite(arg.value)) {
      return new object.NumberObject(parsedNum);
    }
    else {
      return consts.NULL;
    }
  }

  if (arg instanceof object.BooleanObject) {
    if (arg === consts.TRUE) {
      return new object.NumberObject(1);
    }
    else if (arg === consts.FALSE) {
      return new object.NumberObject(0);
    }
  }

  if (arg instanceof object.NullObject) {
    return new object.NumberObject(0);
  }

  return consts.NULL;
});
