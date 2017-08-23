import * as object from '../object';
import * as consts from '../constants';

// Get the first element of an array
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arr ] = args;

  if (arr.getType() !== object.ObjectType.ARRAY_OBJ) {
    return new object.ErrorObject(`Argument to \`first\` must be ARRAY, got ${arr.getType()}.`);
  }

  if (arr.elements.length > 0) {
    return arr.elements[0];
  }

  return consts.NULL;
});
