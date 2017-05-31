/**
 * Copy server settings from old .env file to new config json file.
 */

const chalk = require('chalk');
const config = require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');

const configFileDir = process.env.NODE_CONFIG_DIR;
const configFilePath = path.join(configFileDir, 'default.json');
const localConfigFilePath = path.join(configFileDir, 'local.json');
const configJson = {};

let needsUpgrade = false;

if (config.hasOwnProperty('CP_URL')) {
  configJson.hostname = config.CP_URL;
  needsUpgrade = true;
}

if (config.hasOwnProperty('CP_PORT')) {
  configJson.port = config.CP_PORT;
  needsUpgrade = true;
}

if (config.hasOwnProperty('CP_API_KEY')) {
  configJson.apiKey = config.CP_API_KEY;
  needsUpgrade = true;
}

if (needsUpgrade) {
  console.log('Your configuration settings need updating. Attempting to update automatically...');

  fs.pathExists(localConfigFilePath).then((exists) => {
    if (!exists) {
      fs.readJson(configFilePath).then((configObj) => {
        configObj['alexa-couchpotato'].server = Object.assign(configObj['alexa-couchpotato'].server,
            configJson);

        // Output new local.json file
        fs.outputFile(localConfigFilePath, JSON.stringify(configObj, null, 4)).then(() => {
          console.log(`Config saved to ${chalk.green(path.resolve(localConfigFilePath))}`);
          console.log('Please ' + chalk.yellow('remove your CP settings from the .env file') +
              ' to prevent this from running again in the future.');
        });
      });
    }
    else {
      console.log(chalk.green(path.resolve(localConfigFilePath)) + ' file ' +
          chalk.red('already exists') + '!');
      console.log('Please ' + chalk.yellow('remove your CP settings from the .env file') +
          ' to prevent this from running again in the future.');
    }
  });
}
