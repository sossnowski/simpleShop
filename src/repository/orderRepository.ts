import { Transaction } from 'sequelize';
import { Order } from 'models/Order';
import { OrderBodyType } from 'types/order/addOrderBodyType';
import { OrderProduct } from 'models/OrderProduct';

export const saveOrder = async (orderData: OrderBodyType, transaction: Transaction) => Order.create(
  {
    customerId: orderData.customerId,
  },
  {
    transaction,
  },
);

export const saveOrderProducts = (
  orderUid: string,
  productsUids: string[],
  transaction: Transaction,
) => OrderProduct.bulkCreate(productsUids.map(
  (p) => ({ orderUid, productUid: p }),
), { transaction });
