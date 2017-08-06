/* eslint-disable max-params */

import fs from 'fs';
import repl from 'repl';
import touch from 'touch';

import Lexer from './lexer';
import Parser from './parser';
//import { TokenType } from './token';

const REPL_HISTORY_FILE = '.repl_history';

/*function lex (input, context, filename, callback) {
  const lexer = new Lexer(input);
  const output = [];

  let token = null;

  do {
    token = lexer.nextToken();

    output.push(token);
  }
  while (token.type !== TokenType.EOF);

  return callback(
    output.map((t) => JSON.stringify(t, null, 2))
  );
}*/

function parse (input, context, filename, callback) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  const errors = parser.getErrors();

  if (errors.length) {
    return callback(JSON.stringify(errors, null, 2));
  }
  else {
    return callback(JSON.stringify(program, null, 2));
  }
}

// create REPL server
const server = repl.start({
  prompt: '>> ',
  //eval: lex,
  eval: parse,
});

touch.sync(REPL_HISTORY_FILE);

// load command history from a file
fs.readFileSync(REPL_HISTORY_FILE, 'utf8')
  .split('\n')
  .reverse()
  .filter((line) => line.trim())
  .map((line) => server.history.push(line));

// save command history
server.on('exit', () => {
  fs.appendFileSync(REPL_HISTORY_FILE, '\n' + server.lines.join('\n'));
});
