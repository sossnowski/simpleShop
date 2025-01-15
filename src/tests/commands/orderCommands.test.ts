import { addOrder } from 'commands/orderCommands';
import { connection } from 'config/db';
import { Product } from 'models/Product';
import { saveOrder, saveOrderProducts } from 'repository/orderRepository';
import { getAllOrderProducts } from 'repository/productRepository';
import { updateProductsStock } from 'services/orderService';
import { errorFactory } from 'utils/errors/errorFactory';

jest.mock('repository/orderRepository', () => ({
  saveOrder: jest.fn(),
  saveOrderProducts: jest.fn(),
}));

jest.mock('repository/productRepository', () => ({
  getAllOrderProducts: jest.fn(),
}));

jest.mock('services/orderService', () => ({
  updateProductsStock: jest.fn(),
}));

jest.mock('config/db', () => ({
  connection: {
    transaction: jest.fn(),
  },
}));

describe('addOrder', () => {
  let mockTransaction: any;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    (connection.transaction as jest.Mock).mockResolvedValue(mockTransaction);
    jest.clearAllMocks();
  });

  it('should throw a bad request error if no products are found', async () => {
    (getAllOrderProducts as jest.Mock).mockResolvedValue([]);

    await expect(
      addOrder({
        customerId: 'customer123',
        products: [],
      }),
    ).rejects.toThrow('No products selected');
  });

  it('should save order, products, and update stock successfully', async () => {
    const mockOrder = { uid: 'order123', customerId: 'customer123' };
    const mockProducts = [{ uid: 'product1', stock: 10 }, { uid: 'product2', stock: 5 }];

    (getAllOrderProducts as jest.Mock).mockResolvedValue(mockProducts);
    (saveOrder as jest.Mock).mockResolvedValue(mockOrder);
    (saveOrderProducts as jest.Mock).mockResolvedValue(null);
    (updateProductsStock as jest.Mock).mockReturnValue([Promise.resolve(Product)]);

    const result = await addOrder({
      customerId: 'customer123',
      products: ['product1', 'product2'],
    });

    expect(result).toEqual(mockOrder);
    expect(saveOrder).toHaveBeenCalledWith(
      { customerId: 'customer123', products: ['product1', 'product2'] },
      mockTransaction,
    );
    expect(saveOrderProducts).toHaveBeenCalledWith(
      'order123',
      ['product1', 'product2'],
      mockTransaction,
    );
    expect(updateProductsStock).toHaveBeenCalledWith(
      mockProducts,
      ['product1', 'product2'],
      mockTransaction,
    );
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('should rollback transaction and throw an internal server error on failure', async () => {
    const mockProducts = [{ uid: 'product1', stock: 10 }, { uid: 'product2', stock: 5 }];

    (getAllOrderProducts as jest.Mock).mockResolvedValue(mockProducts);
    (saveOrder as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(
      addOrder({
        customerId: 'customer123',
        products: ['product1', 'product2'],
      }),
    ).rejects.toThrow('Cannot save order');

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(mockTransaction.commit).not.toHaveBeenCalled();
  });

  it('should rollback transaction and propagate an HttpError', async () => {
    const mockProducts = [{ uid: 'product1', stock: 10 }, { uid: 'product2', stock: 5 }];
    const httpError = new Error('HTTP error');
    httpError.name = 'HttpError';

    (getAllOrderProducts as jest.Mock).mockResolvedValue(mockProducts);
    (saveOrder as jest.Mock).mockImplementationOnce(() => Promise.reject(errorFactory().badRequestError('error')));

    await expect(
      addOrder({
        customerId: 'customer123',
        products: ['product1', 'product2'],
      }),
    ).rejects.toThrow('error');

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(mockTransaction.commit).not.toHaveBeenCalled();
  });
});
