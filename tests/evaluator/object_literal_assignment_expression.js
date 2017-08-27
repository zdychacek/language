import test from 'tape';

import { testEval, testStringObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Object literal assignment expression', (t) => {
  const input = '({ "msg": "hello" })["msg"] = "world"';

  const obj = testEval(input);

  t.ok(is(obj, object.ObjectObject), 'object is an object literal');
  t.equal(obj.pairs.size, 1, 'object literal pairs count is 1');

  testStringObject(t, obj.pairs.get('msg').value, 'world');

  t.end();
});
