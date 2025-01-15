import { getAllProducts } from 'queries/productQueries';
import { getAllProductsFromDb } from 'repository/productRepository';

jest.mock('repository/productRepository', () => ({
  getAllProductsFromDb: jest.fn(),
}));

jest.mock('utils/errors/errorFactory', () => ({
  errorFactory: () => ({
    internalServerError: (message: string) => new Error(message),
  }),
}));

describe('Product Service - getAllProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all products when the repository call is successful', async () => {
    const mockProducts = [
      {
        uid: 'product1', name: 'Product 1', price: 10, stock: 100,
      },
      {
        uid: 'product2', name: 'Product 2', price: 20, stock: 50,
      },
    ];

    (getAllProductsFromDb as jest.Mock).mockResolvedValue(mockProducts);

    const products = await getAllProducts();

    expect(getAllProductsFromDb).toHaveBeenCalled();
    expect(products).toEqual(mockProducts);
  });

  it('should throw an internal server error if the repository call fails', async () => {
    const mockError = new Error('Database connection failed');
    (getAllProductsFromDb as jest.Mock).mockRejectedValue(mockError);

    await expect(getAllProducts()).rejects.toThrow('Database connection failed');
  });
});
