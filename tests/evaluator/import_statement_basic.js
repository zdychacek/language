import fs from 'fs';
import path from 'path';
import test from 'tape';

import { testEval } from './utils';
//import { is } from './../utils';
//import * as object from '../../src/evaluator/object';
import Environment from '../../src/evaluator/environment';

test.only('Evaluator - Import statement basic', (t) => {
  const fileName = path.join(__dirname, 'fixtures/module1.lang');
  const input = fs.readFileSync(fileName, 'utf8');

  const env = new Environment();
  const result = testEval(input, env, fileName);

  console.log(result);

  /*t.ok(is(fn, object.FunctionObject), 'object is function');
  t.equal(fn.parameters.length, 1, 'function has 1 parameter');
  t.equal(fn.parameters[0].toString(), 'x', 'parameter name is "x"');
  t.equal(fn.body.toString(), '(x + 2)', 'function has right body');*/

  t.end();
});
