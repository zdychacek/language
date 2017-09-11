import test from 'tape';

import {
  testEval,
  testNumberObject,
  testVoidObject,
} from './utils';

test('Evaluator - Call expression', (t) => {
  const tests = [
    [
      `let identity = (x) -> x
      identity(5)`,
      5,
    ],
    [
      `let identity = (x) -> { return x }
      identity(5)`,
      5,
    ],
    [
      `let double = (x) -> x * 2
      double(5)`,
      10,
    ],
    [
      `let add = (x, y) -> { x + y }
      add(5, 5)`,
      10,
    ],
    [
      `let add = (x, y) -> x + y
      add(5 + 5, add(5, 5))`,
      20,
    ],
    [
      '(x) -> { x }(5)',
      5,
    ],
    [
      `let foo = {
        bar: () -> 1,
        baz: () -> 2
      }
      foo.baz()`,
      2,
    ],
    [
      '() -> {}()',
      undefined,
    ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (expected === undefined) {
      testVoidObject(t, result);
    }
    else {
      testNumberObject(t, result, expected);
    }
  });

  t.end();
});
