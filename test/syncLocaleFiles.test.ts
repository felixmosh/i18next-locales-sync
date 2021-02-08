import path from 'path';
import { generateLocaleFiles } from '../src/generateLocaleFiles';
import { syncLocaleFiles } from '../src/syncLocaleFiles';

describe('syncLocaleFiles', () => {
  it('should sync locale files without namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja'];
    const localeFiles = generateLocaleFiles({
      primaryLanguage,
      otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      fileExtension: '.json',
    });

    expect(syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages })).toHaveProperty('ja', {
      '': {
        data: { test: 'bla' },
        hash: '',
        filePath: path.resolve('./test/fixtures/fixture1/ja.json'),
      },
    });
  });

  it('should sync locale files with namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['ja', 'de'];
    const localeFiles = generateLocaleFiles({
      primaryLanguage,
      otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture2'),
      fileExtension: '.json',
    });

    const result = syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages });

    expect(result).toHaveProperty('ja', {
      common: {
        data: { test: 'bla' },
        hash: '',
        filePath: path.resolve('./test/fixtures/fixture2/ja/common.json'),
      },
      front: {
        data: { title: 'front' },
        hash: '',
        filePath: path.resolve('./test/fixtures/fixture2/ja/front.json'),
      },
    });

    expect(result).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de', test_plural: 'bla-plural' },
        hash: expect.any(String),
        filePath: expect.any(String),
      },
      front: {
        data: { title: 'front' },
        hash: '',
        filePath: path.resolve('./test/fixtures/fixture2/de/front.json'),
      },
    });
  });
});
