import fs from 'fs';
import path from 'path';
import test from 'tape';

import { testEval } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Import statement', (t) => {
  const fileName = path.join(__dirname, 'fixtures/module1.lang');

  const input = fs.readFileSync(fileName, 'utf8');
  const env = new Environment();

  testEval(input, env, fileName);

  t.equal(Object.keys(env.getAllBindings()).length, 1, 'environment contains one binding');

  const binding = env.get('greeting');

  t.ok(binding, 'environment contains "greeting" binding');
  t.ok(is(binding, object.StringObject), 'binding is a string');

  t.end();
});
