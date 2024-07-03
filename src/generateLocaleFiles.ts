import crypto from 'crypto';
import fs from 'fs-extra';
import { fdir } from 'fdir';
import picomatch from 'picomatch';
import path from 'path';
import { LocaleFile, LocalesFiles } from '../types/types';
import { LIB_PREFIX } from './constats';

interface Options {
  primaryLanguage: string;
  otherLanguages: string[];
  localesFolder: string;
  fileExtension: string;
}

function extractLanguagesFromPath(filepath: string, allLanguages: string[]) {
  const pathParts = filepath.split(/[\\/]/g);
  return allLanguages.find((language) => pathParts.some((part) => part === language));
}

function extractNamespaceFromPath(filepath: string, language: string) {
  const pathParts = filepath.split(/[\\/]/g);

  if (pathParts.length < 2) {
    // handle empty namespace
    pathParts.push('');
  }

  const namespaceParts = pathParts.filter((part) => part !== language);

  return namespaceParts.join('/');
}

function addMissingLanguages(localeFiles: LocalesFiles, otherLanguages: string[]) {
  otherLanguages.filter((lang) => !localeFiles[lang]).forEach((lang) => (localeFiles[lang] = {}));

  return localeFiles;
}

function addMissingNamespaces(
  localeFiles: LocalesFiles,
  primaryLanguage: string,
  otherLanguages: string[]
) {
  const primaryFiles = localeFiles[primaryLanguage];

  Object.keys(primaryFiles).forEach((namespace) => {
    otherLanguages.forEach((otherLanguage) => {
      const filePath = primaryFiles[namespace].filePath
        .split(/[\\/]/g)
        .map((part) => {
          if (part.startsWith(primaryLanguage)) {
            return part.replace(primaryLanguage, otherLanguage);
          }
          return part;
        })
        .join(path.sep);

      localeFiles[otherLanguage][namespace] = localeFiles[otherLanguage][namespace] || {
        filePath,
        hash: '',
        data: {},
      };
    });
  });
}

export function populateFromDisk(filePath: string): LocaleFile {
  let data = {};
  let hash = '';

  if (fs.existsSync(filePath)) {
    data = fs.readJSONSync(filePath, { encoding: 'utf8' });

    hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  return { filePath, data, hash };
}

export function generateLocaleFiles({
  localesFolder,
  fileExtension,
  primaryLanguage,
  otherLanguages,
}: Options): LocalesFiles {
  const matcher = picomatch(`**/*${fileExtension}`);
  const paths = new fdir()
    .withFullPaths()
    .filter((path) => matcher(path))
    .crawl(localesFolder)
    .sync();
  const allLanguages = [primaryLanguage].concat(otherLanguages);

  const localeFiles = paths.reduce((structure, filePath) => {
    const remainingPath = path.relative(localesFolder, filePath);
    const filename = path.basename(remainingPath, fileExtension);
    const filepathWithoutExtension = path.join(path.dirname(remainingPath), filename);
    const language = extractLanguagesFromPath(filepathWithoutExtension, allLanguages);

    if (!language) {
      return structure;
    }

    const namespace = extractNamespaceFromPath(filepathWithoutExtension, language);

    structure[language] = structure[language] || {};
    structure[language][namespace] = populateFromDisk(filePath);

    return structure;
  }, {} as LocalesFiles);

  if (!localeFiles[primaryLanguage]) {
    throw new Error(
      `${LIB_PREFIX} There are no files for your primary language (${primaryLanguage})`
    );
  }

  addMissingLanguages(localeFiles, otherLanguages);
  addMissingNamespaces(localeFiles, primaryLanguage, otherLanguages);

  return localeFiles;
}
