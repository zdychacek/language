import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';
import * as ast from '../../src/parser/ast';
import { testInfixExpression } from './utils';
import { is } from '../utils';

test('Parser - For statement', (t) => {
  const input = `
    for a == true {
      break
    }
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  let program = null;

  t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
  t.notEqual(program, null, 'ParseProgram() is not null');
  t.equal(program.statements.length, 1, 'program.statements contains 1 statement');

  const forStmt = program.statements[0];

  t.ok(is(forStmt, ast.ForStatement), 'node is ForStatement');
  testInfixExpression(t, forStmt.condition, 'a', '==', true);

  const blockStmt = forStmt.body;

  t.equal(blockStmt.statements.length, 1, 'block statement contains 1 statement');
  t.ok(is(blockStmt.statements[0], ast.BreakStatement), 'block statement is BreakStatement');

  t.end();
});
