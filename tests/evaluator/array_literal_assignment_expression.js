import test from 'tape';

import { testEval, testNumberObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Array literal assignment expression', (t) => {
  const input = `
    let arr = [ 1, 2 ]
    arr[0] = 28
  `;

  const env = new Environment();
  const result = testEval(input, env);

  const arr = env.get('arr');

  testNumberObject(t, result, 28);
  t.ok(is(arr, object.ArrayObject), 'object is an array literal');
  t.equal(arr.elements.length, 2, 'array literal elements count is 2');
  testNumberObject(t, arr.elements[0], 28);

  t.end();
});
