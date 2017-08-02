import test from 'tape';

import * as ast from '../../src/ast';
import { TokenType } from '../../src/token';

test('AST - String', (t) => {
  const program = new ast.Program(
    [
      new ast.LetStatement(
        { type: TokenType.LET, literal: 'let' },
        new ast.Identifier(
          { type: TokenType.IDENT, literal: 'myVar' },
          'myVar',
        ),
        new ast.Identifier(
          { type: TokenType.IDENT, literal: 'anotherVar' },
          'anotherVar',
        ),
      ),
    ]
  );

  t.equal(program.toString(), 'let myVar = anotherVar;', 'program.toString()');

  t.end();
});
