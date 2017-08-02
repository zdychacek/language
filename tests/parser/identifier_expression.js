import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';
import * as ast from '../../src/ast';
import { checkParserErrors } from './utils';

test('Identifier expression', (t) => {
  const input = 'foobar';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  checkParserErrors(t, parser);

  t.equal(program.statements.length, 1, 'program has not enough statements');

  const stmt = program.statements[0];

  t.ok(stmt instanceof ast.ExpressionStatement, 'program.statements[0] is ast.ExpressionStatement');

  const identifier = stmt.expression;

  t.ok(identifier instanceof ast.Identifier, 'expression is ast.Identifier');
  t.equal(identifier.value, 'foobar');
  t.equal(identifier.tokenLiteral(), 'foobar');

  t.end();
});
