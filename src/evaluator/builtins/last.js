import * as object from '../object';
import * as consts from '../constants';

// Get the last element of an array
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arr ] = args;

  if (arr.getType() !== object.ObjectType.ARRAY_OBJ) {
    return new object.ErrorObject(`Argument to \`last\` must be ARRAY, got ${arr.getType()}.`);
  }

  const { length } = arr.elements;

  if (length > 0) {
    return arr.elements[length - 1];
  }

  return consts.NULL;
});
