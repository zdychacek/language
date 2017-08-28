import test from 'tape';

import { testEval, testNumberObject, testNullObject } from './utils';

test('Evaluator - Object index expression', (t) => {
  const tests = [
    [ '({ "foo": 5 }).foo', 5 ],
    [ '({ "foo": 5 }).bar', null ],
    [ 'let key = "foo"\n ({ "foo": 5 })[key]', 5 ],
    [ '({})["foo"]', null ],
    [ '({ 5: 5 })[5]', 5 ],
    [ '({ [true]: 5 })[true]', 5 ],
    [ '({ [false]: 5 })[false]', 5 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (typeof expected === 'number') {
      testNumberObject(t, result, expected);
    }
    else {
      testNullObject(t, result);
    }
  });

  t.end();
});
