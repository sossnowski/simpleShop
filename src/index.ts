import http from 'http';
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
const port = process.env.PORT;

let server: http.Server;
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

const startServer = async () => {
  try {
    dbClient = await connection.sync({ alter: true });
    server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Connected successfully on port ${port}`);
    });
  } catch (error) {
    dbClient?.close();
    server?.close();
    process.exit();
  }
};

startServer();
handleUnhandledExceptions();

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info('SIGTERM received');
  if (dbClient) dbClient.close();
  if (server) server.close();
});
