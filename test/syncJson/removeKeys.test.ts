import { syncJson } from '../../src/syncJson';

describe('syncJson: remove redundant keys', () => {
  it('should remove redundant keys in json', () => {
    const source = { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } };

    const result = syncJson(source, {
      foo: 'foo',
      outerBar: 'outer bar',
      nested: { bar: 'bar', nestedBar: 'nested bar', array: [3, 4, 5] },
    });

    expect(result).toStrictEqual({
      foo: 'foo',
      nested: { bar: 'bar', array: [3, 4] },
    });

    expect(source).toStrictEqual(source);
  });
});
