import { connection } from 'config/db';
import { HttpError } from 'http-errors';
import { Product } from 'models/Product';
import { saveOrder, saveOrderProducts } from 'repository/orderRepository';
import { getAllOrderProducts } from 'repository/productRepository';
import { updateProductsStock } from 'services/orderService';
import { OrderBodyType } from 'types/order/addOrderBodyType';
import { getUniqueElementsFromArray } from 'utils';
import { errorFactory } from 'utils/errors/errorFactory';

export const addOrder = async (orderData: OrderBodyType) => {
  if (!orderData) throw errorFactory().badRequestError('Bad request');
  const uniqueProductUids = getUniqueElementsFromArray(orderData.products);
  const allOrderProducts = await getAllOrderProducts(uniqueProductUids);
  if (!allOrderProducts.length) throw errorFactory().badRequestError('No products selected');
  const transaction = await connection.transaction();
  try {
    const order = await saveOrder(orderData, transaction);
    await saveOrderProducts(order.uid, orderData.products, transaction);
    const productStockUpdatePromises: Promise<Product>[] = updateProductsStock(
      allOrderProducts,
      orderData.products,
      transaction,
    );
    await Promise.all(productStockUpdatePromises);
    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof HttpError) throw error;
    throw errorFactory().internalServerError('Cannot save order');
  }
};
