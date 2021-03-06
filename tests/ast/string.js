import test from 'tape';

import * as ast from '../../src/parser/ast';
import { Token, TokenType } from '../../src/lexer/token';

test('AST - String', (t) => {
  const program = new ast.Program(
    'noname.lang',
    [
      new ast.LetStatement(
        new Token(TokenType.LET, 'let'),
        new ast.Identifier(
          new Token(TokenType.IDENT, 'myVar'),
          'myVar',
        ),
        new ast.Identifier(
          new Token(TokenType.IDENT, 'anotherVar'),
          'anotherVar',
        ),
      ),
    ]
  );

  t.equal(program.toString(), 'let myVar = anotherVar', 'program.toString()');

  t.end();
});
