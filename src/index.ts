import { LIB_PREFIX } from './constats';
import { generateLocaleFiles } from './generateLocaleFiles';
import { PluralResolver } from './i18next/PluralResolver';
import { syncLocaleFiles } from './syncLocaleFiles';
import { writeToDisk } from './utils/writeToDisk';
import chalk from 'chalk';

interface SyncLocalesOptions {
  primaryLanguage: string;
  otherLanguages: string[];
  localesFolder: string;
  outputFolder?: string;
  fileExtension?: string;
  pluralResolver?: PluralResolver;
}

export function syncLocales({
  primaryLanguage,
  otherLanguages,
  localesFolder,
  outputFolder = localesFolder,
  fileExtension = '.json',
  pluralResolver,
}: SyncLocalesOptions) {
  const localeFiles = generateLocaleFiles({
    primaryLanguage,
    otherLanguages,
    localesFolder,
    fileExtension,
  });

  syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages, pluralResolver });

  writeToDisk({ localeFiles, primaryLanguage, otherLanguages, outputFolder, localesFolder });

  console.log(
    chalk.green`${chalk.bold.greenBright(LIB_PREFIX)} '${localesFolder}' was synced successfully.`
  );
}
