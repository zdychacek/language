import test from 'tape';

import {
  testEval,
  testNumberObject,
  testVoidObject,
} from './utils';
import { is } from '../utils';
import * as object from '../../src/evaluator/object';

test('Evaluator - Member expression: optional chaining', (t) => {
  const obj = `
    let foo = {
      b: {
        c: { d: 1 }
      }
    }
    let bar = null
  `;

  const tests = [
    [ 'foo.b.c.d', 1 ],
    [ 'foo.b.e.c', 'Cannot read property "c" of VOID.' ],
    [ 'foo.b.e?.c', undefined ],
    [ 'foo.e.c', 'Cannot read property "c" of VOID.' ],
    [ 'foo.e?.c', undefined ],
    [ 'foo.c.b()', 'Cannot read property "b" of VOID.' ],
    [ 'foo.c?.b()', undefined ],
    [ 'bar?.foo', undefined ],
    [ 'bar.foo', 'Cannot read property "foo" of NULL.' ],
    [ 'bar?.foo()', undefined ],
    [ 'bar.foo()', 'Cannot read property "foo" of NULL.' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const result = testEval(`${obj}\n${input}`);

    if (typeof expected === 'number') {
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
