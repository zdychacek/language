import len from './builtins/len';
import string from './builtins/string';
import number from './builtins/number';
import boolean from './builtins/boolean';
import first from './builtins/first';
import last from './builtins/last';
import rest from './builtins/rest';
import push from './builtins/push';
import puts from './builtins/puts';

export default {
  // Get length of an argument
  len,
  // Convert an argument to string value or return NULL
  string,
  // Convert an argument to number value or return NULL
  number,
  // Convert an argument to boolean value or return NULL
  boolean,
  // Get the first element of an array
  first,
  // Get the last element of an array
  last,
  // Get the rest of array items from an array
  rest,
  // Push an item into the array
  push,
  // Print to the standard output
  puts,
};
