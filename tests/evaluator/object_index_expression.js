import test from 'tape';

import { testEval, testVoidObject, testNumberObject } from './utils';

test('Evaluator - Object index expression', (t) => {
  const tests = [
    [ '({ "foo": 5 }).foo', 5 ],
    [ '({ "foo": 5 }).bar', '<void>' ],
    [
      `let key = "foo"
      ({ "foo": 5 })[key]`,
      5,
    ],
    [ '({})["foo"]', '<void>' ],
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
      testVoidObject(t, result);
    }
  });

  t.end();
});
