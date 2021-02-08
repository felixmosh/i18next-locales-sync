import { LocalesFiles } from '../../types/types';
import path from 'path';

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
}: Options) {
  // const primaryLocaleFile = localeFiles[primaryLanguage];

  otherLanguages.forEach((otherLanguage) => {
    Object.keys(primaryLanguage).forEach((primaryNamespace) => {
      const filePath = console.log(
        path.relative(localeFiles[otherLanguage][primaryNamespace].filePath, localesFolder)
      );
      // fs.writeJSONSync(
      //   path.join(outputFolder, localeFiles[otherLanguage][primaryNamespace].filePath),
      //   {},
      //   { spaces: 2, encoding: 'utf-8' }
      // );
    });
  });
}
