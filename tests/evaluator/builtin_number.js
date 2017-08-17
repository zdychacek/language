import test from 'tape';

import { testEval, testNumberObject } from './utils';

test('Evaluator - `number` builtin function', (t) => {
  const tests = [
    [ 'number(1)', 1 ],
    [ 'number(false)', 0 ],
    [ 'number(true)', 1 ],
    [ 'number("123")', 123 ],
    [ 'number("1a2b3")', 'null' ],
    [ 'number(() -> x)', 'null' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (typeof expected === 'number') {
      testNumberObject(t, result, expected);
    }
    else if (typeof expected === 'string') {
      t.equal(result.value, expected, 'result has right value');
    }
  });

  t.end();
});
