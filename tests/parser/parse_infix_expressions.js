import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { testInfixExpression } from './utils';

test('Parser - Infix expressions', (t) => {
  const tests = [
    [ '5 + 5', 5, '+', 5 ],
    [ '5 - 5', 5, '-', 5 ],
    [ '5 * 5', 5, '*', 5 ],
    [ '5 / 5', 5, '/', 5 ],
    [ '5 > 5', 5, '>', 5 ],
    [ '5 < 5', 5, '<', 5 ],
    [ '5 == 5', 5, '==', 5 ],
    [ '5 != 5', 5, '!=', 5 ],
    [ 'true == true', true, '==', true ],
    [ 'true != false', true, '!=', false ],
    [ 'false == false', false, '==', false ],
    [ 'a = b', 'a', '=', 'b' ],
  ];

  tests.forEach(([ input, leftValue, operator, rightValue ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
    t.equal(program.statements.length, 1, 'program has 1 statement');

    const stmt = program.statements[0];

    t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

    testInfixExpression(t, stmt.expression, leftValue, operator, rightValue);
  });

  t.end();
});
