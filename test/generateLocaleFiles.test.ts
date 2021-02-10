import path from 'path';
import { generateLocaleFiles } from '../src/generateLocaleFiles';

describe('generateLocaleFiles', () => {
  it('should throw error when there is no files for the primary language', () => {
    expect(() =>
      generateLocaleFiles({
        primaryLanguage: 'ja',
        otherLanguages: ['en'],
        localesFolder: path.resolve('./test/fixtures/fixture1'),
        fileExtension: '.json',
      })
    ).toThrowError('There are no files for your primary language');
  });

  it('should add missing language file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['ja'],
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('ja', {
      '': {
        data: {},
        hash: '',
        filePath: expect.stringContaining('/test/fixtures/fixture1/ja.json'),
      },
    });
  });

  it('should add missing namespace file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['de', 'ja'],
      localesFolder: path.resolve('./test/fixtures/fixture2'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture2/de/common.json'),
      },
      front: {
        data: {},
        hash: '',
        filePath: expect.stringContaining('/test/fixtures/fixture2/de/front.json'),
      },
    });

    expect(localeFiles).toHaveProperty('ja', {
      common: {
        data: {},
        hash: '',
        filePath: expect.stringContaining('/test/fixtures/fixture2/ja/common.json'),
      },
      front: {
        data: {},
        hash: '',
        filePath: expect.stringContaining('/test/fixtures/fixture2/ja/front.json'),
      },
    });
  });

  it('should support nested namespaces', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['de'],
      localesFolder: path.resolve('./test/fixtures/fixture3'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('en', {
      common: {
        data: { test: 'bla', test_plural: 'bla-plural' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/en/common.json'),
      },
      'nested/a': {
        data: { a: 'bla-en' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/en/nested/a.json'),
      },
      'nested/b': {
        data: { b: 'bla-en' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/en/nested/b.json'),
      },
    });

    expect(localeFiles).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/de/common.json'),
      },
      'nested/a': {
        data: { a: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/de/nested/a.json'),
      },
      'nested/b': {
        data: {},
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture3/de/nested/b.json'),
      },
    });
  });

  it('should support {namespace}/{language} folder structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['he'],
      localesFolder: path.resolve('./test/fixtures/fixture4'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('he', {
      common: {
        data: { test: 'bla-he', test_1: 'bla-1' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture4/common/he.json'),
      },
      front: {
        data: { test: 'bla', test_0: 'bla-0' },
        hash: expect.any(String),
        filePath: expect.stringContaining('/test/fixtures/fixture4/front/he.json'),
      },
    });
  });
});
