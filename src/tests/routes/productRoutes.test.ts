import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../app';

const API_PREFIX = '/api/v1';

const TEST_UID = '612dfe2b-4f79-4a52-b295-cd59cd098ebd';

jest.mock('../../commands/productCommands', () => ({
  addProduct: jest.fn((data) => Promise.resolve({ uid: TEST_UID, ...data })),
  decreaseProductStockNumber: jest.fn((uid) => Promise.resolve({
    uid, name: 'Test Product', description: 'test desc', stock: 9, price: 100,
  })),
  increaseProductStockNumber: jest.fn((uid) => Promise.resolve({
    uid, name: 'Test Product', description: 'test desc', stock: 11, price: 100,
  })),
}));

jest.mock('../../queries/productQueries', () => ({
  getAllProducts: jest.fn(() => Promise.resolve([{
    uid: TEST_UID, name: 'Test Product', description: 'test', stock: 10, price: 100,
  }])),
}));

describe('Product Routes', () => {
  describe('GET /products', () => {
    it('should return all products', async () => {
      const response = await request(app).get(`${API_PREFIX}/products`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual([{
        uid: TEST_UID, name: 'Test Product', description: 'test', price: 100, stock: 10,
      }]);
    });
  });

  describe('POST /products', () => {
    it('should throw 422 status', async () => {
      const newProduct = { name: 'New Product', stock: 20 };
      const response = await request(app).post(`${API_PREFIX}/products`).send(newProduct);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 201 if product added', async () => {
      const newProduct = {
        name: 'New Product', description: 'test', price: 100, stock: 20,
      };
      const response = await request(app).post(`${API_PREFIX}/products`).send(newProduct);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual({ ...newProduct, uid: TEST_UID });
    });
  });

  describe('POST /products/:id/sell', () => {
    it('should throw 422', async () => {
      const response = await request(app).post(`${API_PREFIX}/products/1/sell`);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /products/:id/sell', () => {
    it('should decrease product stock', async () => {
      const response = await request(app).post(`${API_PREFIX}/products/${TEST_UID}/sell`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        uid: TEST_UID, name: 'Test Product', description: 'test desc', price: 100, stock: 9,
      });
    });
  });

  describe('POST /products/:id/restock', () => {
    it('should throw 422', async () => {
      const response = await request(app).post(`${API_PREFIX}/products/1/restock`);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /products/:id/restock', () => {
    it('should increase product stock', async () => {
      const response = await request(app).post(`${API_PREFIX}/products/${TEST_UID}/restock`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        uid: TEST_UID, name: 'Test Product', description: 'test desc', price: 100, stock: 11,
      });
    });
  });
});
