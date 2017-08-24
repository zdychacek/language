import test from 'tape';

import { testEval } from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Assignment expression', (t) => {
  const tests = [
    [ 'a = 0', { a: 0 } ],
    [ 'a = b = 2', { a: 2, b: 2 } ],
    [ 'a = b = c = 3', { a: 3, b: 3, c: 3 } ],
    [ 'd = 3', 'Cannot assign to undeclared identifier: "d".' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const env = new Environment();

    // initialize environment
    env.assign('a', new object.NumberObject(1));
    env.assign('b', new object.NumberObject(1));
    env.assign('c', new object.NumberObject(1));

    const result = testEval(input, env);

    if (typeof expected === 'string') {
      t.ok(is(result, object.ErrorObject), 'result is object.ErrorObject');
      t.equal(result.value, expected, 'error has right message');
    }
    else {
      Object.keys(expected).forEach((bindingName) => {
        t.equal(env.get(bindingName).value, expected[bindingName], 'bindings does match');
      });
    }
  });

  t.end();
});
