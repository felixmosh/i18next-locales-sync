import { generateLocaleFiles } from './generateLocaleFiles';
import { syncLocaleFiles } from './syncLocaleFiles';
import { writeToDisk } from './utils/writeToDisk';

interface SyncOptions {
  primaryLanguage: string;
  otherLanguages: string[];
  localesFolder: string;
  outputFolder?: string;
  fileExtension?: string;
}

export function syncLocales({
  primaryLanguage,
  otherLanguages,
  localesFolder,
  outputFolder = localesFolder,
  fileExtension = '.json',
}: SyncOptions) {
  const localeFiles = generateLocaleFiles({
    primaryLanguage,
    otherLanguages,
    localesFolder,
    fileExtension,
  });

  syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages });

  writeToDisk({ localeFiles, primaryLanguage, otherLanguages, outputFolder, localesFolder });

  return localeFiles;
}
