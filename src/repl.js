/* eslint-disable max-params */

import fs from 'fs';
import path from 'path';
import repl from 'repl';
import touch from 'touch';

import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import evaluate from './evaluator/evaluate';
import Environment from './evaluator/environment';

const REPL_HISTORY_FILE = '.repl_history';

function interpret (input, env) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program, env);
}

// create global environment
const globalEnv = new Environment();

function doInterpret (input, context, filename, callback) {
  let result = null;

  try {
    result = interpret(input, globalEnv);
  }
  catch (ex) {
    return callback(`There are some errors:\n ${ex.toString()}`);
  }

  return callback(result.toString());
}

// create REPL server
const server = repl.start({
  prompt: '>> ',
  eval: doInterpret,
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
