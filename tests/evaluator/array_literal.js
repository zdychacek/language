import test from 'tape';

import { testEval, testNumberObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Array literal', (t) => {
  const input = '[ 1, 2 * 2, 3 + 3 ]';

  const arr = testEval(input);

  t.ok(is(arr, object.ArrayObject), 'object is an array');
  t.equal(arr.elements.length, 3, 'array has 3 parameters');

  testNumberObject(t, arr.elements[0], 1);
  testNumberObject(t, arr.elements[1], 4);
  testNumberObject(t, arr.elements[2], 6);

  t.end();
});
