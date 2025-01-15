import { addProduct, decreaseProductStockNumber, increaseProductStockNumber } from 'commands/productCommands';
import { getProductByUid, saveProductInDb } from 'repository/productRepository';
import { checkPriceGreaterThanZero } from 'services/productService';

jest.mock('repository/productRepository', () => ({
  getProductByUid: jest.fn(),
  saveProductInDb: jest.fn(),
}));

jest.mock('services/productService', () => ({
  checkPriceGreaterThanZero: jest.fn(),
}));

jest.mock('utils/errors/errorFactory', () => ({
  errorFactory: () => ({
    badRequestError: (message: string) => new Error(message),
    notFoundError: (message: string) => new Error(message),
  }),
}));

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should throw a bad request error if price is not greater than zero', async () => {
      (checkPriceGreaterThanZero as jest.Mock).mockReturnValue(false);

      await expect(
        addProduct({
          name: 'Test Product', price: 0, stock: 10, description: 'test',
        }),
      ).rejects.toThrow('Price must be greather than 0');
    });

    it('should save product to the database if data is valid', async () => {
      const mockProduct = {
        name: 'Test Product', price: 100, stock: 10, description: 'test',
      };
      (checkPriceGreaterThanZero as jest.Mock).mockReturnValue(true);
      (saveProductInDb as jest.Mock).mockResolvedValue(mockProduct);

      const result = await addProduct(mockProduct);

      expect(checkPriceGreaterThanZero).toHaveBeenCalledWith(100);
      expect(saveProductInDb).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('decreaseProductStockNumber', () => {
    it('should throw a not found error if product does not exist', async () => {
      (getProductByUid as jest.Mock).mockResolvedValue(null);

      await expect(decreaseProductStockNumber('nonexistent-uid')).rejects.toThrow('Product not exist');
    });

    it('should throw a bad request error if stock is already 0', async () => {
      const mockProduct = { uid: 'product1', stock: 0 };
      (getProductByUid as jest.Mock).mockResolvedValue(mockProduct);

      await expect(decreaseProductStockNumber('product1')).rejects.toThrow(
        'Cannot descrease stock number of this product',
      );
    });

    it('should decrease stock and save the product', async () => {
      const mockProduct = {
        uid: 'product1',
        stock: 10,
        save: jest.fn().mockResolvedValue({ uid: 'product1', stock: 9 }),
      };
      (getProductByUid as jest.Mock).mockResolvedValue(mockProduct);

      const result = await decreaseProductStockNumber('product1');

      expect(mockProduct.stock).toBe(9);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual({ uid: 'product1', stock: 9 });
    });
  });

  describe('increaseProductStockNumber', () => {
    it('should throw a not found error if product does not exist', async () => {
      (getProductByUid as jest.Mock).mockResolvedValue(null);

      await expect(increaseProductStockNumber('nonexistent-uid')).rejects.toThrow('Product not exist');
    });

    it('should increase stock and save the product', async () => {
      const mockProduct = {
        uid: 'product1',
        stock: 10,
        save: jest.fn().mockResolvedValue({ uid: 'product1', stock: 11 }),
      };
      (getProductByUid as jest.Mock).mockResolvedValue(mockProduct);

      const result = await increaseProductStockNumber('product1');

      expect(mockProduct.stock).toBe(11);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual({ uid: 'product1', stock: 11 });
    });
  });
});
