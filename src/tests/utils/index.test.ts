import { getUniqueElementsFromArray } from 'utils';

describe('getUniqueElementsFromArray', () => {
  it('should return an empty array when given an empty array', () => {
    const result = getUniqueElementsFromArray([]);
    expect(result).toEqual([]);
  });

  it('should return an array with unique elements', () => {
    const input = ['apple', 'banana', 'apple', 'orange', 'banana'];
    const result = getUniqueElementsFromArray(input);
    expect(result).toEqual(['apple', 'banana', 'orange']);
  });

  it('should return the same array if all elements are unique', () => {
    const input = ['apple', 'banana', 'orange'];
    const result = getUniqueElementsFromArray(input);
    expect(result).toEqual(['apple', 'banana', 'orange']);
  });

  it('should return an empty array when given an array with only duplicates', () => {
    const input = ['apple', 'apple', 'apple'];
    const result = getUniqueElementsFromArray(input);
    expect(result).toEqual(['apple']);
  });

  it('should preserve the order of first occurrences', () => {
    const input = ['apple', 'orange', 'banana', 'apple', 'banana'];
    const result = getUniqueElementsFromArray(input);
    expect(result).toEqual(['apple', 'orange', 'banana']);
  });
});
