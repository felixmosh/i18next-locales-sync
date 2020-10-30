import { syncJson } from '../../src/syncJson';

describe('syncJson: add keys to target obj', () => {
  it('should add missing keys in json', () => {
    const source = { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } };

    expect(syncJson(source, {})).toStrictEqual(source);
  });

  it('should throw exception when the json is too deep', () => {
    const source = { foo: 'foo', nested: { bar: 'bar', array: [1, 2] } };
    const depth = 1;

    expect(() => syncJson(source, {}, depth)).toThrowError('given json with depth that');
  });

  it('should not override existing values', () => {
    const source = { foo: 'foo', nested: { bar: 'bar', array: [1, 2, 'string'] } };
    const result = syncJson(source, { foo: 'original foo', nested: { array: [2] } });

    expect(result).toStrictEqual({
      foo: 'original foo',
      nested: { bar: 'bar', array: [2, 2, 'string'] },
    });

    expect(source).toStrictEqual(source);
  });

  it('should override existing value if types are different', () => {
    const source = { foo: 'foo', nested: { bar: 'bar', array: [1, 2, 'string'] } };
    const result = syncJson(source, { foo: ['original foo'], nested: { array: { '0': 1 } } });

    expect(result).toStrictEqual({
      foo: 'foo',
      nested: { bar: 'bar', array: [1, 2, 'string'] },
    });

    expect(source).toStrictEqual(source);
  });
});
