/* eslint-disable no-console */

import fs from 'fs';

export function die (message) {
  console.log(message);
  process.exit();
}

export function loadFile (fileName) {
  try {
    return fs.readFileSync(fileName, 'utf8');
  }
  catch (ex) {
    if (ex.code === 'ENOENT') {
      die(`File "${fileName}" not found.`);
    }

    die(ex.message);
  }
}
