import path from 'path';
import { generateLocaleFiles } from '../src/generateLocaleFiles';
import { syncLocaleFiles } from '../src/syncLocaleFiles';

describe('syncLocaleFiles', () => {
  it('should sync locale files without namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['jp'];
    const localeFiles = generateLocaleFiles({
      primaryLanguage,
      otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      fileExtension: '.json',
    });

    expect(syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages })).toHaveProperty('jp', {
      '': { data: { test: 'bla' }, hash: '', filePath: null },
    });
  });

  it('should sync locale files with namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['jp', 'de'];
    const localeFiles = generateLocaleFiles({
      primaryLanguage,
      otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture2'),
      fileExtension: '.json',
    });

    const result = syncLocaleFiles({ localeFiles, primaryLanguage, otherLanguages });

    expect(result).toHaveProperty('jp', {
      common: { data: { test: 'bla' }, hash: '', filePath: null },
      front: { data: { title: 'front' }, hash: '', filePath: null },
    });

    expect(result).toHaveProperty('de', {
      common: { data: { test: 'bla-de' }, hash: expect.any(String), filePath: expect.any(String) },
      front: { data: { title: 'front' }, hash: '', filePath: null },
    });
  });
});
