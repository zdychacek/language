import * as object from './object';
import * as consts from './constants';

export default {
  // Get length of an argument
  len: new object.BuiltinObject((...args) => {
    if (args.length !== 1) {
      return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
    }

    const [ arg ] = args;

    if (arg instanceof object.StringObject) {
      return new object.NumberObject(arg.value.length);
    }

    if (arg instanceof object.FunctionObject) {
      return new object.NumberObject(arg.parameters.length);
    }

    return new object.ErrorObject(`Argument to \`len\` not supported, got ${arg.getType()}.`);
  }),
  // Convert an argument to string
  string: new object.BuiltinObject((...args) => {
    if (args.length !== 1) {
      return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
    }

    const [ arg ] = args;

    if (arg instanceof object.StringObject) {
      return arg;
    }

    if (arg instanceof object.NumberObject) {
      return new object.StringObject(arg.$inspect());
    }

    if (arg instanceof object.BooleanObject) {
      return new object.StringObject(arg.$inspect());
    }

    if (arg instanceof object.FunctionObject) {
      return new object.StringObject(arg.$inspect());
    }

    return consts.NULL;
  }),
  // Convert an argument to number
  number: new object.BuiltinObject((...args) => {
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

    return consts.NULL;
  }),
};

