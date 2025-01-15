import createError, { HttpError } from 'http-errors';
import { Transaction } from 'sequelize';
import { updateProductsStock } from 'services/orderService';
import { Product } from 'models/Product';
import { StatusCodes } from 'http-status-codes';
import { errorFactory } from 'utils/errors/errorFactory';

jest.mock('models/Product', () => ({
  Product: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

jest.spyOn(errorFactory(), 'badRequestError').mockImplementation((message?: string) => createError(StatusCodes.BAD_REQUEST, message ?? 'Error'));

describe('Order Service - updateProductsStock', () => {
  let mockTransaction: Transaction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction = {} as Transaction;
  });

  it('should update product stock and return updated products', async () => {
    const mockProducts = [
      {
        uid: 'product1', name: 'test', stock: 5, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
      {
        uid: 'product2', name: 'test', stock: 3, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
    ];

    const allOrderProducts = ['product1', 'product2'];
    const updatedProducts = await updateProductsStock(
        mockProducts, 
        allOrderProducts, 
        mockTransaction
    );

    expect(mockProducts[0].stock).toBe(4);
    expect(mockProducts[1].stock).toBe(2);

    expect(mockProducts[0].save).toHaveBeenCalledWith({ transaction: mockTransaction });
    expect(mockProducts[1].save).toHaveBeenCalledWith({ transaction: mockTransaction });

    expect(updatedProducts.length).toBe(2);
  });

  it('should throw an error if a product has no stock', async () => {
    const mockProducts = [
      {
        uid: 'product1', name: 'test', stock: 0, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
      {
        uid: 'product2', name: 'test', stock: 3, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
    ];

    const allOrderProducts = ['product1', 'product2'];

    try {
      await updateProductsStock(mockProducts, allOrderProducts, {} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).message).toBe('Product product1 out of stock');
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it('should not update stock if the product is not in the list', async () => {
    const mockProducts = [
      {
        uid: 'product1', name: 'test', stock: 5, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
      {
        uid: 'product2', name: 'test', stock: 3, description: 'test', price: 100, save: jest.fn(),
      } as unknown as Product,
    ];

    const allOrderProducts = ['product3'];

    const updatedProducts = await updateProductsStock(
      mockProducts,
      allOrderProducts,
      mockTransaction,
    );

    expect(mockProducts[0].stock).toBe(5);
    expect(mockProducts[1].stock).toBe(3);

    expect(mockProducts[0].save).not.toHaveBeenCalled();
    expect(mockProducts[1].save).not.toHaveBeenCalled();

    expect(updatedProducts.length).toBe(0);
  });

  it('should return an empty array if no products are passed', async () => {
    const updatedProducts = await updateProductsStock([], [], mockTransaction);
    expect(updatedProducts).toEqual([]);
  });
});
