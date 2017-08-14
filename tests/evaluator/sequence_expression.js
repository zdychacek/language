import test from 'tape';

import {
  testEval,
  testNumberObject,
  testBooleanObject,
} from './utils';
import { is } from '../utils';
import * as object from '../../src/object';

test('Evaluator - Sequence expression', (t) => {
  const tests = [
    [ '1, 1 + 2, true', true ],
    [ '1, 2, 3 + 1', 4 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    if (is(evaluated, object.NumberObject)) {
      testNumberObject(t, evaluated, expected);
    }
    else if (is(evaluated, object.BooleanObject)) {
      testBooleanObject(t, evaluated, expected);
    }
    else {
      t.fail(`bad evaluation result "${evaluated}"`);
    }
  });

  t.end();
});
