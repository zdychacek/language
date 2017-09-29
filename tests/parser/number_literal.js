import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testNumberLiteral } from './utils';
import { is } from '../utils';

test('Parser - Number literal', (t) => {
  const tests = [
    [ '5', 5 ],
    [ '3.1415926', 3.1415926 ],
    [ '12e3', 12000 ],
    [ '12.3E-2', 0.123 ],
    [ '123_456_789', 123456789 ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
    t.equal(program.statements.length, 1, 'program has 1 statement');

    const stmt = program.statements[0];

    t.ok(is(stmt, ast.ExpressionStatement), 'program.statements[0] is ast.ExpressionStatement');

    testNumberLiteral(t, stmt.expression, expected);
  });

  t.end();
});
