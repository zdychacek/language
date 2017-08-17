import * as object from './object';

export default {
  // Get length of argument
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
  // Convert arg to string
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

    return new object.ErrorObject(`Argument to \`string\` not supported, got ${arg.getType()}.`);
  }),
};

// if (!Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value)) {}
