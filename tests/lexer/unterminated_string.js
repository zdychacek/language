import test from 'tape';

import Lexer from '../../src/lexer';

test('Lexer - unterminated string', (t) => {
  const input = '"a';

  const lexer = new Lexer(input);

  t.throws(() => lexer.nextToken(), 'Unterminated string  (@1:3).', 'string is unterminated.');

  t.end();
});
