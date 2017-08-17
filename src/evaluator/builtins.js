import * as object from './object';
import { NULL } from './constants';

export default {
  len: new object.BuiltinObject((...args) => {
    console.log(args);
    return NULL;
  }),
};
