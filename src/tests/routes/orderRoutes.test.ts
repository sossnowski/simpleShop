import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { errorFactory } from 'utils/errors/errorFactory';
import { addOrder } from 'commands/orderCommands';
import app from '../../app';

const API_PREFIX = '/api/v1';

const TEST_UID = '612dfe2b-4f79-4a52-b295-cd59cd098ebd';

jest.mock('../../commands/orderCommands', () => ({
  addOrder: jest.fn((orderData) => Promise.resolve({
    uid: TEST_UID,
    customerId: orderData.customerId,
    products: orderData.products,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
}));

describe('Order Routes', () => {
  describe('POST /orders', () => {
    it('should create a new order with valid data', async () => {
      const validOrder = {
        customerId: 'customer123',
        products: ['612dfe2b-4f79-4a52-b295-cd59cd098ebd', '4c84cfb6-430f-4990-9636-0f1be518b864', '612dfe2b-4f79-4a52-b295-cd59cd098ebd'],
      };

      const response = await request(app).post(`${API_PREFIX}/orders`).send(validOrder);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('uid', TEST_UID);
      expect(response.body).toHaveProperty('customerId', validOrder.customerId);
      expect(response.body.products).toEqual(validOrder.products);
    });

    it('should return 422 if customerId is missing', async () => {
      const invalidOrder = {
        products: ['612dfe2b-4f79-4a52-b295-cd59cd098ebd', '4c84cfb6-430f-4990-9636-0f1be518b864', '612dfe2b-4f79-4a52-b295-cd59cd098ebd'],
      };

      const response = await request(app).post(`${API_PREFIX}/orders`).send(invalidOrder);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 422 if products array is empty', async () => {
      const invalidOrder = {
        customerId: 'customer123',
        products: [],
      };

      const response = await request(app).post(`${API_PREFIX}/orders`).send(invalidOrder);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 500 if addOrder throws an error', async () => {
      const errorOrder = {
        customerId: 'customer123',
        products: ['product1', 'product2'],
      };

      addOrder.mockImplementationOnce(() => Promise.reject(errorFactory().internalServerError('error')));

      const response = await request(app).post(`${API_PREFIX}/orders`).send(errorOrder);
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty('message', 'error');
    });
  });
});
