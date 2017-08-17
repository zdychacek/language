import test from 'tape';

import { testEval, testNumberObject } from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test.skip('Evaluator - Builtin functions', (t) => {
  const tests = [
    [ 'len("")', 0 ],
    [ 'len("four")', 4 ],
    [ 'len("hello world")', 11 ],
    [ 'len(1)', 'argument to `len` not supported, got INTEGER' ],
    [ 'len("one", "two")', 'wrong number of arguments. got=2, want=1' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(input);

    if (typeof expected === 'number') {
      testNumberObject(t, result, expected);
    }
    else if (typeof result === 'string') {
      t.ok(is(result, object.ErrorObject), 'result is ErrorObject');
      t.equal(result.message, expected, 'error has right message');
    }
  });

  t.end();
});
