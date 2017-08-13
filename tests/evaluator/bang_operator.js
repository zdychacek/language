import test from 'tape';

import { testBooleanObject, testEval } from './utils';

test('Evaluator - Bang operator', (t) => {
  const tests = [
    [ '!true', false ],
    [ '!false', true ],
    [ '!5', false ],
    [ '!!true', true ],
    [ '!!false', false ],
    [ '!!5', true ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    testBooleanObject(t, evaluated, expected);
  });

  t.end();
});
