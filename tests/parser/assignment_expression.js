import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import Parser from '../../src/parser/parser';

test('Parser - Assignment expression', (t) => {
  const tests = [
    [ 'a = 1', '(a = 1)' ],
    [ 'a = b = 2', '(a = (b = 2))' ],
    [ 'a = b = c = 3', '(a = (b = (c = 3)))' ],
  ];

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');
    t.equal(program.toString(), expected);
  });

  t.end();
});
