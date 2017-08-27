
import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testInfixExpression } from './utils';
import { is } from '../utils';

test('Parser - Object literal with expressions', (t) => {
  const input = '({ "one": 0 + 1, "two": 10 - 8, "three": 15 / 5 })';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.equal(program.statements.length, 1, 'program has not enough statements');

  const { expression: object } = program.statements[0];

  t.ok(is(object, ast.ObjectLiteral), 'program.statements[0] is ast.ObjectLiteral');
  t.equal(object.pairs.size, 3, 'object literal has right pairs count');

  const tests = {
    one: (expr) => testInfixExpression(t, expr, 0, '+', '1'),
    two: (expr) => testInfixExpression(t, expr, 10, '-', '8'),
    three: (expr) => testInfixExpression(t, expr, 15, '/', '5'),
  };

  Object.entries(object.pairs).forEach(([ key, value ]) => {
    t.ok(is(object, ast.StringLiteral), 'key is ast.StringLiteral');

    const testFn = tests[key.toString()];

    t.ok(testFn, 'test function found');

    testFn(value);
  });

  t.end();
});
