import { Transaction } from 'sequelize';
import { Product } from 'models/Product';
import { errorFactory } from 'utils/errors/errorFactory';

export const updateProductsStock = (
  products: Product[],
  allOrderProducts: string[],
  transaction: Transaction,
) => {
  if (!products.length) return [];
  const updatedProducts: Product[] = [];
  allOrderProducts.forEach((orderProduct: string) => {
    const foundProduct = products
      .find((productModel: Product) => productModel.uid === orderProduct);
    if (foundProduct) {
      if (foundProduct.stock < 1) throw errorFactory().badRequestError(`Product ${foundProduct.uid} out of stock`);
      foundProduct.stock -= 1;
      updatedProducts.push(foundProduct);
    }
  });

  return updatedProducts.map((p) => p.save({ transaction }));
};
