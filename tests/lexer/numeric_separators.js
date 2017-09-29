import test from 'tape';

import Lexer from '../../src/lexer/lexer';
import { TokenType } from '../../src/lexer/token';

test('Lexer - Numeric separators', (t) => {
  const tests = [
    [ '123_456.123_456', TokenType.NUMBER ],
    [ '_12', TokenType.IDENT ],
    [ '12_', 'Illegal place for numeric separator (@1:3).' ],
    [ '12.3_', 'Illegal place for numeric separator (@1:5).' ],
    [ '3._1415', 'Illegal place for numeric separator (@1:3).' ],
    [ '3.141_592e1', TokenType.NUMBER ],
    [ '3.141_592e1_', 'Illegal place for numeric separator (@1:12).' ],
  ];

  t.plan(tests.length);

  tests.forEach(([ input, expected ]) => {
    const lexer = new Lexer(input);

    try {
      const { type } = lexer.nextToken();

      t.equal(type, expected, `token type is ${expected}`);
    }
    catch (ex) {
      t.equal(ex.message, expected, 'right error thrown');
    }
  });

  t.end();
});
