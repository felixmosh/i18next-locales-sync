import chalk from 'chalk';
import { WriteOptions } from 'fs-extra';
import { CompatibilityJSON } from '../types/types';
import { LIB_PREFIX } from './constats';
import { generateLocaleFiles } from './generateLocaleFiles';
import { PluralResolver } from './i18next/PluralResolver';
import { syncLocaleFiles } from './syncLocaleFiles';
import { writeToDisk } from './utils/writeToDisk';

interface SyncLocalesOptions {
  primaryLanguage: string;
  secondaryLanguages: string[];
  localesFolder: string;
  outputFolder?: string;
  fileExtension?: string;
  overridePluralRules?: (pluralResolver: PluralResolver) => PluralResolver;
  useEmptyString?: boolean;
  spaces?: WriteOptions['spaces'];
  compatibilityJSON?: CompatibilityJSON;
}

export function syncLocales({
  primaryLanguage,
  secondaryLanguages: otherLanguages,
  localesFolder,
  outputFolder = localesFolder,
  overridePluralRules,
  fileExtension = '.json',
  useEmptyString = false,
  spaces = 2,
  compatibilityJSON = 'v4',
}: SyncLocalesOptions) {
  const pluralResolver = new PluralResolver({ compatibilityJSON });

  if (typeof overridePluralRules === 'function') {
    overridePluralRules(pluralResolver);
  }

  const localeFiles = generateLocaleFiles({
    primaryLanguage,
    otherLanguages,
    localesFolder,
    fileExtension,
  });

  syncLocaleFiles({
    localeFiles,
    primaryLanguage,
    otherLanguages,
    pluralResolver,
    useEmptyString,
  });

  writeToDisk({
    localeFiles,
    primaryLanguage,
    otherLanguages,
    outputFolder,
    localesFolder,
    spaces,
  });

  console.log(
    chalk.green`${chalk.bold.greenBright(LIB_PREFIX)} '${localesFolder}' were synced successfully.`
  );
}
