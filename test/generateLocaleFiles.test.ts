import path from 'path';
import { generateLocaleFiles } from '../src/generateLocaleFiles';

describe('generateLocaleFiles', () => {
  it('should throw error when there is no files for the primary language', () => {
    expect(() =>
      generateLocaleFiles({
        primaryLanguage: 'jp',
        otherLanguages: ['en'],
        localesFolder: path.resolve('./test/fixtures/fixture1'),
        fileExtension: '.json',
      })
    ).toThrowError('There are no files for your primary language');
  });

  it('should add missing language file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['jp'],
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('jp', { '': { data: {}, hash: '', filePath: null } });
  });

  it('should add missing namespace file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['de', 'jp'],
      localesFolder: path.resolve('./test/fixtures/fixture2'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture2/de/common.json'),
      },
      front: { data: {}, hash: '', filePath: null },
    });

    expect(localeFiles).toHaveProperty('jp', {
      common: { data: {}, hash: '', filePath: null },
      front: { data: {}, hash: '', filePath: null },
    });
  });
});
