import test from 'tape';

import { testNullObject, testNumberObject, testEval } from './utils';

test('Evaluator - If/else expression', (t) => {
  const tests = [
    [ 'if true 10', 10 ],
    [ 'if false 10', null ],
    [ 'if 1 10', 10 ],
    [ 'if 1 < 2 10', 10 ],
    [ 'if 1 > 2 10', null ],
    [ 'if 1 < 2 { 10 } else { 20 }', 10 ],
    [ 'if 1 > 2 10 else 20', 20 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    if (expected !== null) {
      testNumberObject(t, evaluated, expected);
    }
    else {
      testNullObject(t, evaluated);
    }
  });

  t.end();
});
