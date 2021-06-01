import { LocalesFiles } from '../types/types';
import { PluralResolver } from './i18next/PluralResolver';
import { syncJson } from './syncJson';

interface Options {
  localeFiles: LocalesFiles;
  primaryLanguage: string;
  otherLanguages: string[];
  pluralResolver: PluralResolver;
  useEmptyString?: boolean;
}

export function syncLocaleFiles({
  localeFiles,
  primaryLanguage,
  otherLanguages,
  pluralResolver,
  useEmptyString,
}: Options): LocalesFiles {
  const primaryLocaleFiles = localeFiles[primaryLanguage];
  otherLanguages.forEach((currentLanguage) => {
    const currentNamespaces = localeFiles[currentLanguage];

    Object.keys(primaryLocaleFiles).forEach((primaryNamespace) => {
      const { data } = syncJson({
        source: { data: primaryLocaleFiles[primaryNamespace].data, language: primaryLanguage },
        target: { data: currentNamespaces[primaryNamespace].data, language: currentLanguage },
        pluralResolver,
        useEmptyString,
      });

      currentNamespaces[primaryNamespace].data = data;
    });
  });

  return localeFiles;
}
