/* eslint-disable no-console */

import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import evaluate from './evaluator/evaluate';
import Environment from './evaluator/environment';
import { loadFile, die } from './utils';

const sourceFileName = process.argv[2];

if (!sourceFileName) {
  die('You have to specify file to interpret.');
}

// load stdlib and source file
const input = loadFile(sourceFileName);

const parser = new Parser(new Lexer(input), sourceFileName);
const env = new Environment();

try {
  const program = parser.parseProgram();
  const result = evaluate(program, env);

  if (result) {
    console.log(result.$inspect());
  }
}
catch (ex) {
  die(ex.toString());
}
