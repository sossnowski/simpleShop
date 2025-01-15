import { checkPriceGreaterThanZero } from 'services/productService';

describe('checkPriceGreaterThanZero', () => {
  it('should return true if the price is greater than zero', () => {
    const result = checkPriceGreaterThanZero(10);
    expect(result).toBe(true);
  });

  it('should return false if the price is zero', () => {
    const result = checkPriceGreaterThanZero(0);
    expect(result).toBe(false);
  });

  it('should return false if the price is less than zero', () => {
    const result = checkPriceGreaterThanZero(-5);
    expect(result).toBe(false);
  });
});
