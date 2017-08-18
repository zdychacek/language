import test from 'tape';

import { testEval } from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Null literal', (t) => {
  const input = 'null';

  const result = testEval(input);

  t.ok(is(result, object.NullObject), 'result is a null literal');
  t.equal(result.value, 'null', 'result has right value');

  t.end();
});
