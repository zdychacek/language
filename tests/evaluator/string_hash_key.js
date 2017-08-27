import test from 'tape';

import * as object from '../../src/evaluator/object';

test('Evaluator - String hash key', (t) => {
  const hello1 = new object.StringObject('Hello World');
  const hello2 = new object.StringObject('Hello World');
  const diff1 = new object.StringObject('My name is johnny');
  const diff2 = new object.StringObject('My name is johnny');

  t.equal(hello1.getHashKey(), hello2.getHashKey(), 'strings with same content have same hash keys');
  t.equal(diff1.getHashKey(), diff2.getHashKey(), 'strings with same content have same hash keys');
  t.notEqual(hello1.getHashKey(), diff1.getHashKey(), 'strings with different content have different hash keys');

  t.end();
});
