import crypto from 'crypto';
import fs from 'fs';
import * as glob from 'glob';
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
  const pathParts = filepath.split(/[\\\/]/g);
  return allLanguages.find((language) => pathParts.some((part) => part.startsWith(language)));
}

function extractNamespaceFromPath(filepath: string, language: string, fileExtension: string) {
  const filename = path.basename(filepath, fileExtension);
  if (filename === language) {
    return ''; // empty namespace
  }

  return filepath.substring(
    filepath.lastIndexOf(language) + language.length + 1,
    filepath.length - fileExtension.length
  );
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
      localeFiles[otherLanguage][namespace] = localeFiles[otherLanguage][namespace] || {
        filePath: null,
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
    const rawData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(rawData);

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
  const paths = glob.sync(`${localesFolder}/**/*${fileExtension}`);
  const allLanguages = [primaryLanguage].concat(otherLanguages);

  const localeFiles = paths.reduce((structure, filePath) => {
    const remainingPath = path.relative(localesFolder, filePath);
    const language = extractLanguagesFromPath(remainingPath, allLanguages);

    if (!language) {
      return structure;
    }

    const namespace = extractNamespaceFromPath(remainingPath, language, fileExtension);

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
