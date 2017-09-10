import * as object from '../object';

const { ObjectType } = object;

// Get length of an argument
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arg ] = args;

  switch (arg.getType()) {
    case ObjectType.STRING_OBJ:
      return new object.NumberObject(arg.value.length);
    case ObjectType.ARRAY_OBJ:
      return new object.NumberObject(arg.elements.length);
    // get function parameters count
    case ObjectType.FUNCTION_OBJ:
      return new object.NumberObject(arg.parameters.length);
  }

  return new object.ErrorObject(`Argument to \`len\` not supported, got ${arg.getType()}.`);
});
