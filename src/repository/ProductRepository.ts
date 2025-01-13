import { Product } from 'models/Product';
import { ProductBodyType } from 'types/product/addProductBodyType';

export const getAllProductsFromDb = () => Product.findAll({ attributes: ['uid', 'name', 'description', 'price', 'stock'] });

export const saveProductInDb = (product: ProductBodyType) => Product.create(product);
