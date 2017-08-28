import fs from 'fs';
import path from 'path';
import test from 'tape';

import { testEval, testNumberObject } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - For statement', (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/for_statement.lang'), 'utf8');

  const result = testEval(input);

  t.ok(is(result, object.NumberObject), 'result is object.NumberObject');
  testNumberObject(t, result, 2);

  t.end();
});
