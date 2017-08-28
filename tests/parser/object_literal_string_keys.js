import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testNumberLiteral } from './utils';
import { is } from '../utils';

test('Parser - Object literal with string keys', (t) => {
  const input = '({ ["one"]: 1, two: 2, "three": 3 })';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.equal(program.statements.length, 1, 'program has not enough statements');

  const { expression: object } = program.statements[0];

  t.ok(is(object, ast.ObjectLiteral), 'program.statements[0] is ast.ObjectLiteral');
  t.equal(object.properties.size, 3, 'object literal has right properties count');

  const expected = {
    one: 1,
    two: 2,
    three: 3,
  };

  Object.entries(object.properties).forEach(([ key, value ]) => {
    t.ok(is(object, ast.StringLiteral), 'key is ast.StringLiteral');

    testNumberLiteral(t, value, expected[key.toString()]);
  });

  t.end();
});
