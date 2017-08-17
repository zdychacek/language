import test from 'tape';

import { testEval } from './utils';
import * as object from '../../src/evaluator/object';
import { is } from '../utils';

test('Evaluator - Error handling', (t) => {
  const tests = [
    [
      '5 + true',
      'type mismatch: NUMBER + BOOLEAN',
    ],
    [
      '5 + true\n 5\n',
      'type mismatch: NUMBER + BOOLEAN',
    ],
    [
      '-true',
      'unknown operator: -BOOLEAN',
    ],
    [
      'true + false',
      'unknown operator: BOOLEAN + BOOLEAN',
    ],
    [
      '5\n true + false\n 5',
      'unknown operator: BOOLEAN + BOOLEAN',
    ],
    [
      'if 10 > 1 { true + false }',
      'unknown operator: BOOLEAN + BOOLEAN',
    ],
    [
      `if 10 > 1 {
        if 10 > 1 {
          return true + false
        }
        return 1
      }`,
      'unknown operator: BOOLEAN + BOOLEAN',
    ],
    [
      'foobar',
      'identifier not found: foobar',
    ],
    [
      '"Hello" - "World"',
      'unknown operator: STRING - STRING',
    ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    t.ok(is(evaluated, object.ErrorObject), 'error returned');
    t.equal(evaluated.value, expected, 'error has right message');
  });

  t.end();
});
