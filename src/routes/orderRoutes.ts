import { addOrder } from 'commands/orderCommands';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from 'middlewares/validation';
import { OrderBodyType } from 'types/order/addOrderBodyType';
import { orderValidation } from 'validation/orderValidation';

const router = express.Router();

router.post(
  '/',
  [...orderValidation, validation],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: OrderBodyType = req.body;
      const order = await addOrder(orderData);
      res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
