import { Product } from 'models/Product';
import { ProductBodyType } from 'types/product/addProductBodyType';

export const getAllProductsFromDb = () => Product.findAll({ attributes: ['uid', 'name', 'description', 'price', 'stock'] });

export const getAllOrderProducts = (productsUids: string[]) => Product.findAll({ where: { uid: productsUids }, attributes: ['uid', 'stock'] });

export const getProductByUid = (uid: string) => Product.findOne({ where: { uid }, attributes: ['uid', 'name', 'description', 'price', 'stock'] });

export const saveProductInDb = (product: ProductBodyType) => Product.create(product);
