import { PluralResolver } from '../../src/i18next/PluralResolver';
import { syncJson } from '../../src/syncJson';

describe('syncJson: plurals', () => {
  const pluralResolver = new PluralResolver({ compatibilityJSON: 'v4' });

  it('should add plural form', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };

    const actual = syncJson({ source, target: { data: {}, language: 'he' }, pluralResolver });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_one: 'book en',
      book_two: 'books en',
      book_other: 'books en',
    });
  });

  it('should add plural form with empty string as a value', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: { data: { book_two: 'books he 0' }, language: 'he' },
      pluralResolver,
      useEmptyString: true,
    });

    expect(actual.data).toStrictEqual({
      book: '',
      book_one: '',
      book_two: 'books he 0',
      book_other: '',
    });
  });

  it('should add plural form only if the target language needs it', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({ source, target: { data: {}, language: 'ja' }, pluralResolver });

    expect(actual.data).toStrictEqual({ book: 'book en' });
  });

  it("should add keep base form when source doesn't have it and target language doesn't supports plural forms", () => {
    const source = {
      data: { book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: { data: { book: 'book ja', book_other: 'book other ja' }, language: 'ja' },
      pluralResolver,
    });

    expect(actual.data).toStrictEqual({ book: 'book ja' });
  });

  it('should not override existing plural forms', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: { data: { book_other: 'books de' }, language: 'de' },
      pluralResolver,
    });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_one: 'book en',
      book_other: 'books de',
    });
  });

  it('should not override existing values', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: {
        data: { book: 'book de', book_one: 'book de', book_other: 'books de' },
        language: 'de',
      },
      pluralResolver,
    });

    expect(actual.data).toStrictEqual({
      book: 'book de',
      book_one: 'book de',
      book_other: 'books de',
    });
  });

  it('should not override existing values', () => {
    const source = {
      data: { book: 'book en', book_one: 'book en', book_other: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: {
        data: { book: 'book de', book_one: 'book de' },
        language: 'de',
      },
      pluralResolver,
      useEmptyString: true,
    });

    expect(actual.data).toStrictEqual({
      book: 'book de',
      book_one: 'book de',
      book_other: '',
    });
  });

  it('should handle plural of none standard plural form as a source (he)', () => {
    const source = {
      data: {
        book: 'book he',
        book_one: 'book one he',
        book_two: 'books two he',
        book_other: 'books other he',
      },
      language: 'he',
    };
    const actual = syncJson({ source, target: { data: {}, language: 'en' }, pluralResolver });

    expect(actual.data).toStrictEqual({
      book: 'book he',
      book_one: 'book one he',
      book_other: 'books other he',
    });
  });

  it("should not remove plurals when the source lang doesn't have plural form", () => {
    const source = {
      data: {
        book: 'book ja',
      },
      language: 'ja',
    };
    const actual = syncJson({
      source,
      target: {
        data: {
          book: 'book en',
          book_other: 'books en',
        },
        language: 'en',
      },
      pluralResolver,
    });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_other: 'books en',
    });
  });
});
