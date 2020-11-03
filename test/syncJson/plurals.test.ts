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
});
