import test from 'tape';

import { testEval } from './utils';

test('Evaluator - `string` builtin function', (t) => {
  const tests = [
    [ 'string(4)', '4' ],
    [ 'string("a")', 'a' ],
    [ 'string(() -> x)', '() -> x' ],
    [ 'string((x, y) -> x + 1 - 2)', '(x, y) -> ((x + 1) - 2)' ],
    [ 'string(true)', 'true' ],
    [ 'string(false)', 'false' ],
    [ 'string(null)', 'null' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    t.equal(result.value, expected, 'object is StringObject');
  });

  t.end();
});
