import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import evaluate from '../../src/evaluator';
import * as object from '../../src/object';
import { is } from '../utils';

function testEval (input) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program);
}

function testNumberObject (t, obj, expected) {
  t.ok(is(obj, object.NumberObject), 'object is Number');
  t.equal(obj.value, expected, 'object has right value');
}

test.skip('Evaluator - Number expression', (t) => {
  const tests = [
    [ '5;', 5 ],
    [ '10;', 10 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const evaluated = testEval(input);

    testNumberObject(t, evaluated, expected);
  });

  t.end();
});
