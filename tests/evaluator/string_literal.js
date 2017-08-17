import test from 'tape';

import { testEval } from './utils';
import { is } from '../utils';
import * as object from '../../src/object';

test('Evaluator - String literal', (t) => {
  const input = '"Hello World!"';

  const str = testEval(input);

  t.ok(is(str, object.StringObject), 'object is a string');
  t.equal(str.value, 'Hello World!', 'string has right value');

  t.end();
});
