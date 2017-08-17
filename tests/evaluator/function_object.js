import test from 'tape';

import { testEval } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Function object', (t) => {
  const input = '(x) -> x + 2';

  const fn = testEval(input);

  t.ok(is(fn, object.FunctionObject), 'object is function');
  t.equal(fn.parameters.length, 1, 'function has 1 parameter');
  t.equal(fn.parameters[0].toString(), 'x', 'parameter name is "x"');
  t.equal(fn.body.toString(), '(x + 2)', 'function has right body');

  t.end();
});
