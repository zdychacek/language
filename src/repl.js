/* eslint-disable max-params */

import fs from 'fs';
import repl from 'repl';
import touch from 'touch';

import Lexer from './lexer';
import Parser from './parser';

const REPL_HISTORY_FILE = '.repl_history';

function parse (input, context, filename, callback) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  let program = null;
  let errors = [];

  try {
    program = parser.parseProgram();
    errors = parser.getErrors();
  }
  catch (ex) {
    errors.unshift(ex.toString());
  }

  if (errors.length) {
    return callback(`There are some errors:\n ${errors.join('\n')}`);
  }
  else {
    return callback(program.toString());
  }
}

// create REPL server
const server = repl.start({
  prompt: '>> ',
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
