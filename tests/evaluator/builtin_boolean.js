import test from 'tape';

import { testEval, testBooleanObject } from './utils';

test('Evaluator - `boolean` builtin function', (t) => {
  const tests = [
    [ 'boolean(true)', true ],
    [ 'boolean(false)', false ],
    [ 'boolean("")', false ],
    [ 'boolean("abc")', true ],
    [ 'boolean(0)', false ],
    [ 'boolean(2)', true ],
    [ 'boolean(null)', false ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (typeof expected === 'boolean') {
      testBooleanObject(t, result, expected);
    }
    else if (typeof expected === 'string') {
      t.equal(result.value, expected, 'result has right value');
    }
  });

  t.end();
});
