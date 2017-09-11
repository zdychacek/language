import test from 'tape';

import {
  testEval,
  testNumberObject,
} from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Member expression', (t) => {
  const obj = 'let foo = { b: 1 }';

  const tests = [
    [ 'foo.b', 1 ],
    [ 'foo["b"]', 1 ],
    [ 'foo["b"].c', 'Cannot read property "c" of NUMBER.' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(`${obj}\n${input}`);

    if (typeof expected === 'number') {
      testNumberObject(t, result, expected);
    }
    else {
      t.ok(is(result, object.ErrorObject), 'result is ErrorObject');
      t.equal(result.value, expected, 'error has right message');
    }
  });

  t.end();
});
