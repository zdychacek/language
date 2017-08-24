/* eslint-disable no-console */

import path from 'path';
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
const input = loadFile(path.join(__dirname, '../lib/stdlib.lang')) + '\n' + loadFile(sourceFileName);

const lexer = new Lexer(input);
const parser = new Parser(lexer);
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
