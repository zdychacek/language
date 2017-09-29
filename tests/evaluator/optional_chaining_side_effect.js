import test from 'tape';

import { testEval } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Optional chaining (side effect testing)', (t) => {
  const input = `
    let foo = null
    let counter = 1 # counter for side effect testing

    foo?.[(() -> counter = counter + 1)()]
  `;

  const env = new Environment();

  const result = testEval(input, env);

  t.notOk(is(result, object.ErrorObject), 'there is no error');

  const counterBinding = env.get('counter');

  t.ok(counterBinding, 'environment contains "counter" binding');
  t.ok(is(counterBinding, object.NumberObject), 'binding is a number');
  t.equal(counterBinding.value, 1, 'binding object value is 1');

  t.end();
});
