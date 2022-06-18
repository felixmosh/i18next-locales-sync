#!/usr/bin/env node

import fs from 'fs-extra';
import * as path from 'path';
import yargs from 'yargs';
import { LIB_PREFIX } from './constats';
import chalk from 'chalk';
import { syncLocales } from './index';

const options = yargs.usage('i18next-locales-sync -p en -s de ja he -l ./path/to/locales').option({
  primaryLanguage: {
    alias: 'p',
    type: 'string',
    description: 'The primary (source) language',
    default: 'en',
  },
  secondaryLanguages: {
    alias: 's',
    description: 'A list of all other supported languages',
    type: 'array',
    default: [],
  },
  localesFolder: {
    alias: 'l',
    description: 'The locals folder path (can be relative)',
    type: 'string',
    normalize: true,
  },
  outputFolder: {
    alias: 'o',
    description: 'The output folder',
    defaultDescription: '`localesFolder`',
    type: 'string',
    normalize: true,
  },
  config: {
    alias: 'c',
    description: 'A path to the config file',
    type: 'string',
    normalize: true,
  },
  useEmptyString: {
    alias: 'e',
    description: 'Use empty string as a value for new keys',
    type: 'boolean',
    normalize: true,
    default: false,
    defaultDescription: '`false`',
  },
  spaces: {
    alias: 'sp',
    description: 'Number of indentation spaces in json output',
    type: 'number',
    normalize: true,
    default: 2,
  },
}).argv;

if (options.config) {
  options.config = path.resolve(options.config);
  if (!fs.existsSync(options.config)) {
    throw new Error(chalk.red`${LIB_PREFIX} Config file '${options.config}' doesn't exist`);
  }

  const usersOptions = require(options.config);

  Object.assign(options, usersOptions);
}

if (!options.localesFolder) {
  throw new Error(chalk.red`${LIB_PREFIX} 'localesFolder' is mandatory option`);
} else {
  options.localesFolder = path.resolve(options.localesFolder);

  if (!fs.existsSync(options.localesFolder)) {
    throw new Error(
      chalk.red`${LIB_PREFIX} Locales folder '${options.localesFolder}' doesn't exist`
    );
  }
}

if (options.outputFolder) {
  options.outputFolder = path.resolve(options.outputFolder);
}

syncLocales({
  primaryLanguage: options.primaryLanguage,
  secondaryLanguages: options.secondaryLanguages,
  localesFolder: options.localesFolder,
  outputFolder: options.outputFolder,
  overridePluralRules: options.overridePluralRules as any,
  useEmptyString: options.useEmptyString,
  spaces: options.spaces,
});
