import * as object from '../../src/evaluator/object';
import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import evaluate from '../../src/evaluator/evaluate';
import Environment from '../../src/evaluator/environment';
import { is } from '../utils';

export function testBooleanObject (t, obj, expected) {
  t.ok(is(obj, object.BooleanObject), 'object is Boolean');
  t.equal(obj.value, expected, 'object has right value');
}

export function testNumberObject (t, obj, expected) {
  t.ok(is(obj, object.NumberObject), 'object is Number');
  t.equal(obj.value, expected, 'object has right value');
}

export function testStringObject (t, obj, expected) {
  t.ok(is(obj, object.StringObject), 'object is String');
  t.equal(obj.value, expected, 'object has right value');
}

export function testNullObject (t, obj) {
  t.ok(is(obj, object.NullObject), 'object is Null');
}

export function testVoidObject (t, obj) {
  t.ok(is(obj, object.VoidObject), 'object is Void');
}

export function testEval (input, env = new Environment(), fileName = '') {
  const lexer = new Lexer(input, fileName);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program, env);
}
