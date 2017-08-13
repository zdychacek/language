import test from 'tape';

import { testEval, testNumberObject } from './utils';

test('Evaluator - Closures', (t) => {
  const input = `
    let newAdder = (x) -> (y) -> x + y
    let addTwo = newAdder(2)

    addTwo(2)
  `;

  testNumberObject(t, testEval(input), 4);

  t.end();
});
