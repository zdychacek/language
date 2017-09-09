import test from 'tape';

import { testEval } from './utils';
import * as object from '../../src/evaluator/object';
import { is } from '../utils';

test('Evaluator - Error handling', (t) => {
  const tests = [
    [
      '5 + true',
      'Type mismatch: NUMBER + BOOLEAN.',
    ],
    [
      `5 + true
      5`,
      'Type mismatch: NUMBER + BOOLEAN.',
    ],
    [
      '-true',
      'Unknown operator: -BOOLEAN.',
    ],
    [
      'true + false',
      'Unknown operator: BOOLEAN + BOOLEAN.',
    ],
    [
      `5
      true + false
      5`,
      'Unknown operator: BOOLEAN + BOOLEAN.',
    ],
    [
      'if 10 > 1 { true + false }',
      'Unknown operator: BOOLEAN + BOOLEAN.',
    ],
    [
      `if 10 > 1 {
        if 10 > 1 {
          return true + false
        }
        return 1
      }`,
      'Unknown operator: BOOLEAN + BOOLEAN.',
    ],
    [
      'foobar',
      'Identifier not found: "foobar".',
    ],
    [
      '"Hello" - "World"',
      'Unknown operator: STRING - STRING.',
    ],
    [
      'import "module.lang"',
      'Error while importing "module.lang" file.',
    ],
    [
      `let obj = { "name": "Monkey" }
      obj[(x) -> x]`,
      'Unusable as object key: FUNCTION.',
    ],
    [
      `let arr = [ 1, 2, 3 ]
      arr["a"] = 2`,
      'Index expression must evaluate to NUMBER, got STRING instead.',
    ],
    [
      `let arr = [ 1, 2, 3 ]
      arr[5] = 2`,
      'Index expression must evaluate to value in range <0,2>.',
    ],
    [
      '"hello"[0]="H"',
      'Index operator not supported: STRING.',
    ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    t.ok(is(evaluated, object.ErrorObject), 'error returned');
    t.equal(evaluated.value, expected, 'error has right message');
  });

  t.end();
});
