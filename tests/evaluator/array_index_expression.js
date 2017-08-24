import test from 'tape';

import {
  testNumberObject,
  testStringObject,
  testNullObject,
  testEval,
} from './utils';

test('Evaluator - Array index expression', (t) => {
  const tests = [
    [ '[1, 2, 3][0]', 1 ],
    [ '[1, 2, 3][1]', 2 ],
    [ '[1, 2, 3][2]', 3 ],
    [ 'let i = 0\n [1][i]', 1 ],
    [ '[1, 2, 3][1 + 1]', 3 ],
    [ 'let myArray = [1, 2, 3]\n myArray[2]', 3 ],
    [ 'let myArray = [1, 2, 3]\n myArray[0] + myArray[1] + myArray[2]', 6 ],
    [ 'let myArray = [1, 2, 3]\n let i = myArray[0]\n myArray[i]', 2 ],
    [ '[1, 2, 3][3]', null ],
    [ '"hello"[0]', 'h' ],
    [ '"hello"[1]', 'e' ],
    [ '"hello"[10]', null ],
    //[ '[1, 2, 3][-1]', 3 ],
    //[ '[1, 2, 3, 4][1:3]', [ 2, 3 ] ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    if (typeof expected === 'number') {
      testNumberObject(t, evaluated, expected);
    }
    else if (typeof expected === 'string') {
      testStringObject(t, evaluated, expected);
    }
    else {
      testNullObject(t, evaluated);
    }
  });

  t.end();
});
