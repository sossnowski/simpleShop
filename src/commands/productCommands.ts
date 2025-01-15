import { getProductByUid, saveProductInDb } from 'repository/productRepository';
import { checkPriceGreaterThanZero } from 'services/productService';
import { ProductBodyType } from 'types/product/addProductBodyType';
import { errorFactory } from 'utils/errors/errorFactory';

export const addProduct = async (productData: ProductBodyType) => {
  if (!productData) throw errorFactory().badRequestError('Bad request');
  if (!checkPriceGreaterThanZero(productData.price)) throw errorFactory().badRequestError('Price must be greather than 0');

  return saveProductInDb(productData);
};

export const decreaseProductStockNumber = async (uid: string) => {
  const product = await getProductByUid(uid);
  if (!product) throw errorFactory().notFoundError('Product not exist');
  if (product.stock === 0) throw errorFactory().badRequestError('Cannot descrease stock number of this product');
  product.stock -= 1;
  return product.save();
};

export const increaseProductStockNumber = async (uid: string) => {
  const product = await getProductByUid(uid);
  if (!product) throw errorFactory().notFoundError('Product not exist');
  product.stock += 1;
  return product.save();
};
