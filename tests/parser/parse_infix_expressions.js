import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors, testInfixExpression } from './utils';

test('Parser - Infix expressions', (t) => {
  const tests = [
    [ '5 + 5;', 5, '+', 5 ],
    [ '5 - 5;', 5, '-', 5 ],
    [ '5 * 5;', 5, '*', 5 ],
    [ '5 / 5;', 5, '/', 5 ],
    [ '5 > 5;', 5, '>', 5 ],
    [ '5 < 5;', 5, '<', 5 ],
    [ '5 == 5;', 5, '==', 5 ],
    [ '5 != 5;', 5, '!=', 5 ],
    [ 'true == true', true, '==', true ],
    [ 'true != false', true, '!=', false ],
    [ 'false == false', false, '==', false ],
  ];

  tests.forEach(([ input, leftValue, operator, rightValue ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    checkParserErrors(t, parser);

    t.equal(program.statements.length, 1, 'program has 1 statement');

    const stmt = program.statements[0];

    t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

    testInfixExpression(t, stmt.expression, leftValue, operator, rightValue);
  });

  t.end();
});
