import * as object from '../object';
import * as consts from '../constants';

// Get the rest of array items from an array
export default new object.BuiltinObject((...args) => {
  if (args.length !== 1) {
    return new object.ErrorObject(`Wrong number of arguments, got=${args.length}, want=1.`);
  }

  const [ arr ] = args;

  if (arr.getType() !== object.ObjectType.ARRAY_OBJ) {
    return new object.ErrorObject(`Argument to \`rest\` must be ARRAY, got ${arr.getType()}.`);
  }

  const { length } = arr.elements;

  if (length > 0) {
    const newElements = arr.elements.slice(1);

    return new object.ArrayObject(newElements);
  }

  return consts.NULL;
});
