import { LocalesFiles } from '../types/types';
import { syncJson } from './syncJson';

interface Options {
  localeFiles: LocalesFiles;
  primaryLanguage: string;
  otherLanguages: string[];
}

export function syncLocaleFiles({
  localeFiles,
  primaryLanguage,
  otherLanguages,
}: Options): LocalesFiles {
  const primaryLocaleFiles = localeFiles[primaryLanguage];
  otherLanguages.forEach((currentLanguage) => {
    const currentNamespaces = localeFiles[currentLanguage];

    Object.keys(primaryLocaleFiles).forEach((primaryNamespace) => {
      const { data } = syncJson({
        source: { data: primaryLocaleFiles[primaryNamespace].data, language: primaryLanguage },
        target: { data: currentNamespaces[primaryNamespace].data, language: currentLanguage },
      });

      currentNamespaces[primaryNamespace].data = data;
    });
  });

  return localeFiles;
}
