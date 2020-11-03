import { syncJson } from '../../src/syncJson';

describe('syncJson: plurals', () => {
  it('should add plural form', () => {
    const source = {
      data: { book: 'book en', book_plural: 'books en' },
      language: 'en',
    };
    const actual = syncJson({ source, target: { data: {}, language: 'he' } });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_0: 'books en',
      book_1: 'books en',
      book_2: 'books en',
      book_3: 'books en',
    });
  });

  it('should add plural form only if the target language needs it', () => {
    const source = {
      data: { book: 'book en', book_plural: 'books en' },
      language: 'en',
    };
    const actual = syncJson({ source, target: { data: {}, language: 'ja' } });

    expect(actual.data).toStrictEqual({ book: 'book en' });
  });

  it('should not override existing plural forms', () => {
    const source = {
      data: { book: 'book en', book_plural: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: { data: { book_plural: 'books de' }, language: 'de' },
    });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_plural: 'books de',
    });
  });

  it('should not override existing values', () => {
    const source = {
      data: { book: 'book en', book_plural: 'books en' },
      language: 'en',
    };
    const actual = syncJson({
      source,
      target: { data: { book: 'book de', book_plural: 'books de' }, language: 'de' },
    });

    expect(actual.data).toStrictEqual({
      book: 'book de',
      book_plural: 'books de',
    });
  });

  it('should handle plural of none standard plural form as a source (he)', () => {
    const source = {
      data: {
        book: 'book he',
        book_0: 'books 0 he',
        book_1: 'books 1 he',
        book_2: 'books 2 he',
        book_3: 'books 3 he',
      },
      language: 'he',
    };
    const actual = syncJson({ source, target: { data: {}, language: 'en' } });

    expect(actual.data).toStrictEqual({ book: 'book he', book_plural: 'books 3 he' });
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
          book_plural: 'books en',
        },
        language: 'en',
      },
    });

    expect(actual.data).toStrictEqual({
      book: 'book en',
      book_plural: 'books en',
    });
  });
});
