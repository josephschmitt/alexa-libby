#!/usr/bin/env node

const fs = require('fs-extra');
const deployTemplate = `
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_ROLE=
`;

// Copy default env file to .env if no .env exists
fs.pathExists('.env').then((exists) => {
  if (!exists) {
    return fs.readFile('default.env', 'utf-8').then((file) => {
      fs.outputFile('.env', deployTemplate.trim() + '\n\n' + file);
    });
  }
});
