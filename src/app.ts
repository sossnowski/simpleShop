import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { connection } from 'config/db';
import routes from 'routes';
import { errorHandler, handleUnhandledExceptions } from 'middlewares/errorHandler';
import { errorFactory } from 'utils/errors/errorFactory';

dotenv.config();

const app = express();
let dbClient: Sequelize | undefined;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use('/api/v1', routes);
app.use((
  req: Request,
  res: Response,
  next: NextFunction,
) => next(errorFactory().notFoundError(req.path)));
app.use(errorHandler);

const connect = async () => {
  try {
    dbClient = await connection.sync({ alter: true });
  } catch (error) {
    dbClient?.close();
    process.exit();
  }
};

connect();
handleUnhandledExceptions();

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info('SIGTERM received');
  if (dbClient) dbClient.close();
});

export default app;
