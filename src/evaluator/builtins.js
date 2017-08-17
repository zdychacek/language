import * as object from './object';

export default {
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
};
