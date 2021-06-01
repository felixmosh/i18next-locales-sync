import { PluralResolver } from '../../src/i18next/PluralResolver';
import { syncJson } from '../../src/syncJson';

describe('syncJson: basic keys', () => {
  const pluralResolver = new PluralResolver();

  it('should throw exception when the json is too deep', () => {
    const source = { data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } }, language: 'en' };

    expect(() =>
      syncJson({ source, target: { data: {}, language: 'he' }, depth: 1, pluralResolver })
    ).toThrowError('given json with depth that');
  });

  describe('add', () => {
    it('should add missing keys in json', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } },
        language: 'en',
      };
      const actual = syncJson({ source, target: { data: {}, language: 'he' }, pluralResolver });

      expect(actual.data).toStrictEqual(source.data);
      expect(source).toStrictEqual(source);
    });

    it('should not override existing values', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2, 'string'] } },
        language: 'en',
      };
      const result = syncJson({
        source,
        target: {
          data: { foo: 'original foo', nested: { array: [2] } },
          language: 'he',
        },
        pluralResolver,
      });

      expect(result.data).toStrictEqual({
        foo: 'original foo',
        nested: { bar: 'bar', array: [2, 2, 'string'] },
      });

      expect(source).toStrictEqual(source);
    });

    it('should override existing value if types are different', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2, 'string'] } },
        language: 'en',
      };
      const result = syncJson({
        source,
        target: {
          data: { foo: ['original foo'], nested: { array: { '0': 1 } } },
          language: 'he',
        },
        pluralResolver,
      });

      expect(result.data).toStrictEqual({
        foo: 'foo',
        nested: { bar: 'bar', array: [1, 2, 'string'] },
      });

      expect(source).toStrictEqual(source);
    });

    it('should keep values on same json structure', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2, 'string'] } },
        language: 'en',
      };

      const result = syncJson({
        source,
        target: {
          data: { foo: 'he foo', nested: { bar: 'he bar', array: ['he 1', 'he 2', 'he string'] } },
          language: 'he',
        },
        pluralResolver,
      });

      expect(result.data).toStrictEqual({
        foo: 'he foo',
        nested: { bar: 'he bar', array: ['he 1', 'he 2', 'he string'] },
      });
    });
  });

  describe('remove', () => {
    it('should remove redundant keys in json', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } },
        language: 'en',
      };

      const result = syncJson({
        source,
        target: {
          data: {
            foo: 'foo',
            outerBar: 'outer bar',
            nested: { bar: 'bar', nestedBar: 'nested bar', array: [3, 4, 5] },
          },
          language: 'he',
        },
        pluralResolver,
      });

      expect(result.data).toStrictEqual({
        foo: 'foo',
        nested: { bar: 'bar', array: [3, 4] },
      });

      expect(source).toStrictEqual(source);
    });
  });

  describe('sort', () => {
    it("should sort target's keys by the source order", () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } },
        language: 'en',
      };
      const target = {
        data: { nested: { array: [3], bar: 't-bar' }, foo: 't-foo' },
        language: 'he',
      };

      const result = syncJson({ source, target, pluralResolver });

      expect(result.data).toStrictEqual({ foo: 't-foo', nested: { bar: 't-bar', array: [3, 2] } });

      expect(Object.keys(result.data)).toStrictEqual(Object.keys(source.data));
      expect(Object.keys((result.data as any).nested)).toStrictEqual(
        Object.keys(source.data.nested)
      );
    });
  });

  describe('useEmptyString = true', () => {
    it('should add missing keys in json and use empty string', () => {
      const source = {
        data: { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } },
        language: 'en',
      };
      const actual = syncJson({
        source,
        target: { data: { foo: 'he foo' }, language: 'he' },
        pluralResolver,
        useEmptyString: true,
      });

      expect(actual.data).toStrictEqual({
        foo: 'he foo',
        nested: { bar: '', array: ['', ''] },
      });
      expect(source).toStrictEqual(source);
    });
  });
});
