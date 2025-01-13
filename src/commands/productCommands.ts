import { getProductByUid, saveProductInDb } from 'repository/ProductRepository';
import { ProductBodyType } from 'types/product/addProductBodyType';
import { errorFactory } from 'utils/errors/errorFactory';

export const addProduct = async (productData: ProductBodyType) => {
  if (!productData) throw errorFactory().badRequestError('Bad request');

  return saveProductInDb(productData);
};

export const decreaseProductStockNumber = async (uid: string) => {
  const product = await getProductByUid(uid);
  if (!product || product.stock === 0) throw errorFactory().badRequestError('Cannot change stock number of this product');
  product.stock -= 1;
  return product.save();
};

export const increaseProductStockNumber = async (uid: string) => {
  const product = await getProductByUid(uid);
  if (!product) throw errorFactory().notFoundError('Product not exists');
  product.stock += 1;
  return product.save();
};
