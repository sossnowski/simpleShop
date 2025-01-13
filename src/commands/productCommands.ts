import { saveProductInDb } from 'repository/ProductRepository';
import { ProductBodyType } from 'types/product/addProductBodyType';
import { errorFactory } from 'utils/errors/errorFactory';

export const addProduct = async (productData: ProductBodyType) => {
  if (!productData) throw errorFactory().badRequestError('Bad request');

  return saveProductInDb(productData);
};
