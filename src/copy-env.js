import fs from 'fs-extra';
import path from 'path';

/**
 * Makes a .env file from the default.env if the .env doesn't exist.
 */
const outputDir = process.env.PWD;
const file = path.join(outputDir, '.env');
fs.pathExists(file)
  .then((exists) => {
    if (!exists) {
      fs.readFile(path.join(outputDir, 'default.env')).then((contents) => {
        fs.outputFile(file, contents);
      });
    }
  });
