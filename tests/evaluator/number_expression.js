import test from 'tape';

import { testNumberObject, testEval } from './utils';

test('Evaluator - Number expression', (t) => {
  const tests = [
    [ '5', 5 ],
    [ '10', 10 ],
    [ '5', 5 ],
    [ '10', 10 ],
    [ '-5', -5 ],
    [ '-10', -10 ],
    [ '5 + 5 + 5 + 5 - 10', 10 ],
    [ '2 * 2 * 2 * 2 * 2', 32 ],
    [ '-50 + 100 + -50', 0 ],
    [ '5 * 2 + 10', 20 ],
    [ '5 + 2 * 10', 25 ],
    [ '20 + 2 * -10', 0 ],
    [ '50 / 2 * 2 + 10', 60 ],
    [ '2 * (5 + 10)', 30 ],
    [ '3 * 3 * 3 + 10', 37 ],
    [ '3 * (3 * 3) + 10', 37 ],
    [ '(5 + 10 * 2 + 15 / 3) * 2 + -10', 50 ],
  ];

  tests.forEach(([ input, expected ]) => {
    testNumberObject(t, testEval(input), expected);
  });

  t.end();
});
