
import test from 'tape';

import { testEval, testNumberObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import * as consts from '../../src/evaluator/constants';

test('Evaluator - Object literals', (t) => {
  const input = `
    let two = "two"
    ({
      "one": 10 - 9,
      [two]: 1 + 1,
      ["thr" + "ee"]: 6 / 2,
      4: 4,
      [true]: 5,
      [false]: 6,
      seven: 7 / 1
    })
  `;

  const result = testEval(input);

  t.ok(is(result, object.ObjectObject), 'eval returned object');

  const expected = new Map();

  expected.set(new object.StringObject('one').getHashKey(), 1);
  expected.set(new object.StringObject('two').getHashKey(), 2);
  expected.set(new object.StringObject('three').getHashKey(), 3);
  expected.set(new object.NumberObject(4).getHashKey(), 4);
  expected.set(consts.TRUE.getHashKey(), 5);
  expected.set(consts.FALSE.getHashKey(), 6);
  expected.set(new object.StringObject('seven').getHashKey(), 7);

  t.equal(result.properties.size, expected.size, 'eval returned right properties count');

  expected.forEach((expectedValue, expectedKey) => {
    const property = result.properties.get(expectedKey);

    t.ok(property, 'property for given key found');

    testNumberObject(t, property.value, expectedValue);
  });

  t.end();
});
