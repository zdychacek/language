import test from 'tape';

import {
  testEval,
  testNumberObject,
  testVoidObject,
  testNullObject,
} from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Call expression: optional chaining', (t) => {
  const obj = `
    let foo = {
      bar: () -> null
    }
    let qux = null
  `;

  const tests = [
    [ 'foo.bar()', null ],
    [ 'qux()', 'Cannot call NULL as a function.' ],
    [ 'qux?()', undefined ],
    [ 'foo.bar?()', null ],
    [ 'foo.bar()()', 'Cannot call NULL as a function.' ],
    [ 'foo.bar()?()', undefined ],
    [ 'foo.bar()?().b()["c"]()()', undefined ],
    [ 'qux?.bar', undefined ],
    [ 'qux?.["ba" + "r"]()', undefined ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(`${obj}\n${input}`);

    if (expected === null) {
      testNullObject(t, result, expected);
    }
    else if (typeof expected === 'number') {
      testNumberObject(t, result, expected);
    }
    else if (typeof expected === 'string') {
      t.ok(is(result, object.ErrorObject), 'result is ErrorObject');
      t.equal(result.value, expected, 'error has right message');
    }
    else {
      testVoidObject(t, result, expected);
    }
  });

  t.end();
});
