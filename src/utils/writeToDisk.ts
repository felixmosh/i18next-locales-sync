import crypto from 'crypto';
import { LocalesFiles } from '../../types/types';
import path from 'path';
import fs from 'fs-extra';

interface Options {
  localeFiles: LocalesFiles;
  primaryLanguage: string;
  otherLanguages: string[];
  outputFolder: string;
  localesFolder: string;
}

export function writeToDisk({
  localeFiles,
  primaryLanguage,
  otherLanguages,
  localesFolder,
  outputFolder,
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
        otherLanguageLocaleFile.hash !==
          crypto
            .createHash('md5')
            .update(JSON.stringify(otherLanguageLocaleFile.data))
            .digest('hex')
      ) {
        fs.ensureFileSync(outputFilePath);
        fs.writeJSONSync(outputFilePath, otherLanguageLocaleFile.data, {
          spaces: 2,
          encoding: 'utf-8',
        });
      }
    });
  });
}
