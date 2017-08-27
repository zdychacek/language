import fs from 'fs';
import path from 'path';
import test from 'tape';

import { testEval } from './utils';
import { is } from './../utils';
import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test('Evaluator - Import statement alias', (t) => {
  const fileName = path.join(__dirname, 'fixtures/import_with_alias.lang');

  const input = fs.readFileSync(fileName, 'utf8');
  const env = new Environment();

  testEval(input, env, fileName);

  t.equal(Object.keys(env.getAllBindings()).length, 1, 'environment contains one binding');

  const moduleBinding = env.get('mod');

  t.ok(moduleBinding, 'environment contains "mod" binding');
  t.ok(is(moduleBinding, object.ObjectObject), 'binding is an object');
  t.equal(moduleBinding.pairs.size, 1, 'binding object has one pair');

  const binding = moduleBinding.pairs.get('greeting');

  t.ok(binding, 'binding object has "greeting" property');
  t.deepEqual(binding.value, { value: 'Hello World!!!' }, 'binding value is "Hello World!!!"');

  t.end();
});
