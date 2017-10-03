/* eslint-disable no-console */

import path from 'path';
import util from 'util';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import evaluate from './evaluator/evaluate';
import Environment from './evaluator/environment';
import { loadFile, die } from './utils';

const sourceFileName = path.join(__dirname, '..', process.argv[2]);
const flag = process.argv[3] && process.argv[3].replace(/-/g, '');

if (!sourceFileName) {
  die('You have to specify file to interpret.');
}

const input = loadFile(sourceFileName);
const lexer = new Lexer(input, sourceFileName);
const parser = new Parser(lexer);
const env = new Environment();

function lex () {
  const tokens = [];

  try {
    while (true) {
      const token = lexer.nextToken();

      tokens.push(token);

      if (token.type === 'EOF') {
        break;
      }
    }
  }
  catch (ex) {
    die(ex.toString());
  }

  console.log(util.inspect(tokens, { colors: true }));
}

function parse () {
  try {
    console.log(util.inspect(parser.parseProgram(), { colors: true, depth: null }));
  }
  catch (ex) {
    die(ex.toString());
  }
}

function interpret () {
  try {
    const program = parser.parseProgram();
    const result = evaluate(program, env);

    if (result) {
      console.log(result.toString());
    }
  }
  catch (ex) {
    die(ex.toString());
  }
}

switch (flag) {
  case 'lex':
    lex();
    break;
  case 'parse':
    parse();
    break;
  default:
    interpret();
}
