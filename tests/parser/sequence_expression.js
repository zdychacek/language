import test from 'tape';

import Lexer from '../../src/lexer';
import Parser from '../../src/parser';

test('Parser - Sequence expression', (t) => {
  const tests = [
    [ 'x, y', 2 ],
    [ 'x + 1, y, z', 3 ],
  ];

  tests.forEach(([ input, expectedExpressionsCount ]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    let program = null;

    t.doesNotThrow(() => program = parser.parseProgram(), 'There are no parsing errors.');

    const stmt = program.statements[0];
    const sequence = stmt.expression;

    t.equal(sequence.expressions.length, expectedExpressionsCount, 'sequence has right expressions count');
  });

  t.end();
});
