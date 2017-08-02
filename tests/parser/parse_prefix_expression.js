import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors } from './utils';

function testIntegerLiteral (t, literal, value) {
  t.ok(literal instanceof ast.IntegerLiteral, 'literal is ast.IntegerLiteral');
  t.equal(literal.value, value, `integer.value is ${value}`);
  t.equal(literal.tokenLiteral(), value.toString(), `integer.tokenLiteral() is ${value}`);
}

test.skip('Integer literal expression', (t) => {
  const tests = [
    [ '!5', '!', '5' ],
    [ '-15', '-', '15' ],
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
    t.ok(expression.operator, operator, 'expression has right operator');

    testIntegerLiteral(t, expression.Right, integerValue);
  });

  t.end();
});
