import test from 'tape';

import { testEval, testNumberObject } from './utils';

test('Evaluator - Function application', (t) => {
  const tests = [
    [ 'let identity = (x) -> x\n identity(5)', 5 ],
    [ 'let identity = (x) -> { return x }\n identity(5)', 5 ],
    [ 'let double = (x) -> x * 2\n double(5)', 10 ],
    [ 'let add = (x, y) -> { x + y }\n add(5, 5)', 10 ],
    [ 'let add = (x, y) -> x + y\n add(5 + 5, add(5, 5))', 20 ],
    [ '(x) -> { x }(5)', 5 ],
  ];

  tests.forEach(([ input, expected ]) => {
    testNumberObject(t, testEval(input), expected);
  });

  t.end();
});
