import test from 'tape';

import { testBooleanObject, testEval } from './utils';

test('Evaluator - Boolean expression', (t) => {
  const tests = [
    [ 'true', true ],
    [ 'false', false ],
    [ '1 < 2', true ],
    [ '1 > 2', false ],
    [ '1 < 1', false ],
    [ '1 > 1', false ],
    [ '1 == 1', true ],
    [ '1 != 1', false ],
    [ '1 == 2', false ],
    [ '1 != 2', true ],
    [ 'true == true', true ],
    [ 'false == false', true ],
    [ 'true == false', false ],
    [ 'true != false', true ],
    [ 'false != true', true ],
    [ '(1 < 2) == true', true ],
    [ '(1 < 2) == false', false ],
    [ '(1 > 2) == true', false ],
    [ '(1 > 2) == false', true ],
    [ '"a" == "a"', true ],
    [ '"a" == "ba"', false ],
    [ '"a" != "a"', false ],
    [ '"a" != "ba"', true ],
    [ 'true && false', false ],
    [ 'true || false', true ],
    [ 'false || true && false', false ],
    [ 'true && false || true', true ],
    [ 'false && true || true', true ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    testBooleanObject(t, evaluated, expected);
  });

  t.end();
});
