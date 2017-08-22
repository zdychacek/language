/* eslint-disable no-console */

import fs from 'fs';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import evaluate from './evaluator/evaluate';
import Environment from './evaluator/environment';

const fileName = process.argv[2];

function die (message) {
  console.log(message);
  process.exit();
}

if (!fileName) {
  die('You have to specify file to interpret.');
}

let input = '';

try {
  input = fs.readFileSync(fileName, 'utf8');
}
catch (ex) {
  if (ex.code === 'ENOENT') {
    die(`File "${fileName}" not found.`);
  }

  die(ex.message);
}

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
