import { resolve } from 'path';
import { generateLocaleFiles } from '../src/generateLocaleFiles';

describe('generateLocaleFiles', () => {
  it('should throw error when there is no files for the primary language', () => {
    expect(() =>
      generateLocaleFiles({
        primaryLanguage: 'ja',
        otherLanguages: ['en'],
        localesFolder: resolve('./test/fixtures/fixture1'),
        fileExtension: '.json',
      })
    ).toThrowError('There are no files for your primary language');
  });

  it('should add missing language file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['ja'],
      localesFolder: resolve('./test/fixtures/fixture1'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('ja', {
      '': {
        data: {},
        hash: '',
        filePath: expect.stringMatching('fixtures/fixture1/ja.json'.replace(/[/]/g, '[\\\\/]+')),
      },
    });
  });

  it('should add missing namespace file structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['de', 'ja'],
      localesFolder: resolve('./test/fixtures/fixture2'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de', test_one: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture2/de/common.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      front: {
        data: {},
        hash: '',
        filePath: expect.stringMatching(
          'fixtures/fixture2/de/front.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });

    expect(localeFiles).toHaveProperty('ja', {
      common: {
        data: {},
        hash: '',
        filePath: expect.stringMatching(
          'fixtures/fixture2/ja/common.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      front: {
        data: {},
        hash: '',
        filePath: expect.stringMatching(
          'fixtures/fixture2/ja/front.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });
  });

  it('should support nested namespaces', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['de'],
      localesFolder: resolve('./test/fixtures/fixture3'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('en', {
      common: {
        data: { test: 'bla en', test_one: 'bla one en', test_other: 'bla other en' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/en/common.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      'nested/a': {
        data: { a: 'bla-en' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/en/nested/a.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      'nested/b': {
        data: { b: 'bla-en' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/en/nested/b.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });

    expect(localeFiles).toHaveProperty('de', {
      common: {
        data: { test: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/de/common.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      'nested/a': {
        data: { a: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/de/nested/a.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      'nested/b': {
        data: {},
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture3/de/nested/b.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });
  });

  it('should support {namespace}/{language} folder structure', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['he'],
      localesFolder: resolve('./test/fixtures/fixture4'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('he', {
      common: {
        data: { test: 'bla-he', test_many: 'bla-many' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture4/common/he.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      front: {
        data: { test: 'bla', test_few: 'bla-few' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture4/front/he.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });
  });

  it('should support {namespace}/{language} folder structure when namespace starts with lang', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en',
      otherLanguages: ['he'],
      localesFolder: resolve('./test/fixtures/fixture6'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('he', {
      common: {
        data: { test: 'bla-he', test_many: 'bla-many' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture6/common/he.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      hebrew: {
        data: { test: 'bla', test_few: 'bla-few' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture6/hebrew/he.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });
  });

  it('should support full locale code', () => {
    const localeFiles = generateLocaleFiles({
      primaryLanguage: 'en-uk',
      otherLanguages: ['de-at'],
      localesFolder: resolve('./test/fixtures/fixture7'),
      fileExtension: '.json',
    });

    expect(localeFiles).toHaveProperty('de-at', {
      common: {
        data: { test: 'bla-de', test_one: 'bla-de' },
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture7/de-at/common.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
      front: {
        data: {},
        hash: expect.any(String),
        filePath: expect.stringMatching(
          'fixtures/fixture7/de-at/front.json'.replace(/[/]/g, '[\\\\/]+')
        ),
      },
    });
  });
});
