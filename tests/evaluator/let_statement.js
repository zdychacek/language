import test from 'tape';

import { testNumberObject, testEval } from './utils';

test('Evaluator - Let statement', (t) => {
  const tests = [
    [ 'let a = 5\n a', 5 ],
    [ 'let a = 5 * 5\n a', 25 ],
    [ 'let a = 5\n let b = a\n b', 5 ],
    [ 'let a = 5\n let b = a\n let c = a + b + 5\n c', 15 ],
  ];

  tests.forEach(([ input, expected ]) => {
    testNumberObject(t, testEval(input), expected);
  });

  t.end();
});
