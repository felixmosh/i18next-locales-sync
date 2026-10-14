import fs from 'fs-extra';
import path from 'path';
import { LocalesFiles } from '../../types/types';
import { hashJson } from './hashJson';

interface Options {
  localeFiles: LocalesFiles;
  primaryLanguage: string;
  otherLanguages: string[];
  outputFolder: string;
  localesFolder: string;
  spaces: string | number;
}

export function writeToDisk({
  localeFiles,
  primaryLanguage,
  otherLanguages,
  localesFolder,
  outputFolder,
  spaces,
}: Options) {
  const primaryLocaleFile = localeFiles[primaryLanguage];

  [primaryLanguage].concat(otherLanguages).forEach((otherLanguage) => {
    Object.keys(primaryLocaleFile).forEach((primaryNamespace) => {
      const otherLanguageLocaleFile = localeFiles[otherLanguage][primaryNamespace];

      const filePath = path.relative(localesFolder, otherLanguageLocaleFile.filePath);
      const outputFilePath = path.join(outputFolder, filePath);

      if (
        localesFolder !== outputFolder ||
        otherLanguageLocaleFile.hash === '' ||
        otherLanguageLocaleFile.hash !== hashJson(otherLanguageLocaleFile.data)
      ) {
        fs.ensureFileSync(outputFilePath);
        fs.writeJSONSync(outputFilePath, otherLanguageLocaleFile.data, {
          spaces,
          encoding: 'utf-8',
        });
      }
    });
  });
}
