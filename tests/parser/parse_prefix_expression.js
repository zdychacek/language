import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors, testIntegerLiteral } from './utils';

test('Integer literal expression', (t) => {
  const tests = [
    [ '!5', '!', 5 ],
    [ '-15', '-', 15 ],
  ];

  tests.forEach(([ input, operator, integerValue ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    checkParserErrors(t, parser);

    t.equal(program.statements.length, 1, 'program has 1 statement');

    const stmt = program.statements[0];

    t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

    const expression = stmt.expression;

    t.ok(expression instanceof ast.PrefixExpression, 'expression is ast.PrefixExpression');
    t.equal(expression.operator, operator, 'expression has right operator');

    testIntegerLiteral(t, expression.right, integerValue);
  });

  t.end();
});
