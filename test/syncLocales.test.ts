import { vol, DirectoryJSON } from 'memfs';
import { syncLocales } from '../src';
import path from 'path';

function makePathNoneUnique(fileSystemList: DirectoryJSON) {
  return Object.keys(fileSystemList).reduce((result, filePath) => {
    const noneUniquePath = path.relative(path.resolve('.'), filePath).replace(/[\\]/g, '/');
    result[noneUniquePath] = fileSystemList[filePath];
    return result;
  }, {} as any);
}

describe('syncLocales - E2E', () => {
  it('should sync locale files without namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'he', 'de'];
    const outputFolder = path.resolve('./test/output/fixture1');

    syncLocales({
      primaryLanguage,
      secondaryLanguages: otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      outputFolder,
      fileExtension: '.json',
    });

    expect(makePathNoneUnique(vol.toJSON(outputFolder))).toMatchSnapshot();
  });

  it('should sync locale files with namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'he', 'de'];
    const outputFolder = '/mem-fs/output/fixture2';

    syncLocales({
      primaryLanguage,
      secondaryLanguages: otherLanguages,
      localesFolder: '/mem-fs/fixtures/fixture2',
      outputFolder,
      fileExtension: '.json',
    });

    expect(makePathNoneUnique(vol.toJSON(outputFolder))).toMatchSnapshot();
  });

  it('should sync locale files with nested namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'he', 'de'];
    const outputFolder = path.resolve('./test/output/fixture3');

    syncLocales({
      primaryLanguage,
      secondaryLanguages: otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture3'),
      outputFolder,
      fileExtension: '.json',
    });

    expect(makePathNoneUnique(vol.toJSON(outputFolder))).toMatchSnapshot();
  });

  it('should sync locales to the same locales folder', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'he', 'de'];
    const localesFolder = path.resolve('./test/fixtures/fixture3');

    syncLocales({
      primaryLanguage,
      secondaryLanguages: otherLanguages,
      localesFolder: localesFolder,
      outputFolder: localesFolder,
      fileExtension: '.json',
    });

    expect(makePathNoneUnique(vol.toJSON(localesFolder))).toMatchSnapshot();
  });

  it('should sync locale files with different folder structure', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'he', 'de'];
    const outputFolder = path.resolve('./test/output/fixture4');

    syncLocales({
      primaryLanguage,
      secondaryLanguages: otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture4'),
      outputFolder,
      fileExtension: '.json',
    });

    expect(makePathNoneUnique(vol.toJSON(outputFolder))).toMatchSnapshot();
  });
});
