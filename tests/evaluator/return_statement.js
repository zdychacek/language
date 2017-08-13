import test from 'tape';

import {
  testVoidObject,
  testNumberObject,
  testEval,
} from './utils';

test('Evaluator - Return statement', (t) => {
  const tests = [
    [ 'return 10', 10 ],
    [ 'return 10\n 9', 10 ],
    [ 'return 2 * 5\n 9', 10 ],
    [ '9\n return 2 * 5\n 9', 10 ],
    [ 'return', undefined ],
    [ `if 10 > 1 {
        if 10 > 1 {
          return 10
        }

        return 1
      }`, 10 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    if (typeof expected === 'number') {
      testNumberObject(t, evaluated, expected);
    }
    else {
      testVoidObject(t, evaluated);
    }
  });

  t.end();
});
