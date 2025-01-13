import { addProduct } from 'commands/productCommands';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from 'middlewares/validation';
import { getAllProducts } from 'queries/productQueries';
import { ProductBodyType } from 'types/product/addProductBodyType';
import { productValidation } from 'validation/productValidation';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await getAllProducts();
      res.status(StatusCodes.OK).json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  [...productValidation, validation],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: ProductBodyType = req.body;
      const product = await addProduct(productData);
      res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
