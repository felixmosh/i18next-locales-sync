import chalk from 'chalk';
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
}

export function syncLocales({
  primaryLanguage,
  secondaryLanguages: otherLanguages,
  localesFolder,
  outputFolder = localesFolder,
  overridePluralRules,
  fileExtension = '.json',
  useEmptyString = false,
}: SyncLocalesOptions) {
  const pluralResolver = new PluralResolver();

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
  });

  console.log(
    chalk.green`${chalk.bold.greenBright(LIB_PREFIX)} '${localesFolder}' were synced successfully.`
  );
}
