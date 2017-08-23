import * as object from '../object';

// Push an item into the array
export default new object.BuiltinObject((...args) => {
  if (args.length !== 2) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=2.`);
  }

  const [ arg, element ] = args;

  if (arg.getType() !== object.ObjectType.ARRAY_OBJ) {
    return new object.ErrorObject(`Argument to \`push\` must be ARRAY, got ${arg.getType()}.`);
  }

  return new object.ArrayObject(arg.elements.concat(element));
});
