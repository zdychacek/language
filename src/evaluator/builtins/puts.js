import * as object from '../object';
import * as consts from '../constants';

// Print to the standard output
export default new object.BuiltinObject((...args) => {
  const out = args
    .map((arg) => {
      let value = arg.toString();

      if (arg instanceof object.StringObject) {
        // we want strings to be logged without quotes
        value = arg.toString().replace(/^"|"$/g, '');
      }

      return value;
    })
    .join(' ');

  console.log(out); // eslint-disable-line

  return consts.NULL;
});
