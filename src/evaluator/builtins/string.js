import * as object from '../object';
import * as consts from '../constants';

// Convert an argument to string value or return NULL
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;

  if (arg instanceof object.StringObject) {
    return arg;
  }

  if (arg instanceof object.NumberObject) {
    return new object.StringObject(arg.toString());
  }

  if (arg instanceof object.BooleanObject) {
    return new object.StringObject(arg.toString());
  }

  if (arg instanceof object.FunctionObject) {
    return new object.StringObject(arg.toString());
  }

  if (arg instanceof object.NullObject) {
    return new object.StringObject(arg.toString());
  }

  return consts.NULL;
});
