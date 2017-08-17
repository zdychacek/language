import test from 'tape';

import { testEval } from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - `string` builtin function', (t) => {
  const tests = [
    // strings
    [ 'string(4)', '4' ],
    [ 'string("a")', 'a' ],
    // functions
    [ 'string(() -> x)', '() -> x' ],
    [ 'string((x, y) -> x + 1 - 2)', '(x, y) -> ((x + 1) - 2)' ],
    // booleans
    [ 'string(true)', 'true' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (is(result, object.ErrorObject)) {
      t.equal(result.message, expected, 'error has right message');
    }
    else {
      t.equal(result.value, expected, 'object is StringObject');
    }
  });

  t.end();
});
