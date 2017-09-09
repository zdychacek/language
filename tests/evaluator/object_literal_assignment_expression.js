import test from 'tape';

import { testEval, testStringObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Object literal assignment expression', (t) => {
  const input = `
    let obj = { "msg": "hello" }
    obj.msg = "world"
  `;

  const env = new Environment();
  const result = testEval(input, env);

  const obj = env.get('obj');

  testStringObject(t, result, 'world');
  t.ok(is(obj, object.ObjectObject), 'object is an object literal');
  t.equal(obj.properties.size, 1, 'object literal properties count is 1');
  testStringObject(t, obj.properties.get('msg').value, 'world');

  t.end();
});
