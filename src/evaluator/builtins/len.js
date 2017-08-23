import * as object from '../object';

// Get length of an argument
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;

  switch (arg.constructor) {
    case object.StringObject:
      return new object.NumberObject(arg.value.length);
    case object.ArrayObject:
      return new object.NumberObject(arg.elements.length);
    // get function parameters count
    case object.FunctionObject:
      return new object.NumberObject(arg.parameters.length);
  }

  return new object.ErrorObject(`Argument to \`len\` not supported, got ${arg.getType()}.`);
});
