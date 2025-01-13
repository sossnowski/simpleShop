import { getAllProductsFromDb } from 'repository/ProductRepository';

export const getAllProducts = async () => getAllProductsFromDb();
