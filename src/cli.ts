#!/usr/bin/env node

import { Command, InvalidOptionArgumentError } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import pkg from '../package.json';
import { syncLocales } from './index';

function ensureAbsolutePath(folderPath: string) {
  if (!path.isAbsolute(folderPath)) {
    folderPath = path.resolve(folderPath);
  }

  if (!fs.existsSync(folderPath)) {
    throw new InvalidOptionArgumentError(chalk.red(`\n'${folderPath}' doesn't exist`));
  }

  return folderPath;
}

const program = new Command();

program
  .version(pkg.version)
  .option('-p, --primaryLanguage <string>', 'The primary language', 'en')
  .option(
    '-s, --secondaryLanguage <string...>',
    'The secondary language, may be a list of languages'
  )
  .option(
    '-l, --localesFolder <string>',
    'The locals folder path (can be relative)',
    ensureAbsolutePath
  )
  .option(
    '-o, --outputFolder <string>',
    'The output folder, by default it will be the localesFolder',
    ensureAbsolutePath
  )
  .option('-c, --config <string>', 'The path to config file', ensureAbsolutePath);

program.parse();

const options = program.opts();

if (options.config) {
  const usersOptions = require(options.config);

  Object.assign(options, usersOptions);
}

syncLocales({
  primaryLanguage: options.primaryLanguage,
  otherLanguages: options.secondaryLanguage,
  localesFolder: options.localesFolder,
  outputFolder: options.outputFolder,
  overridePluralRules: options.overridePluralRules,
});
