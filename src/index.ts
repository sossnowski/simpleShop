import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { connection } from 'config/db';

dotenv.config();

const app = express();
const port = process.env.PORT;

let server: http.Server;
let dbClient: Sequelize | undefined;

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

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info('SIGTERM received');
  if (dbClient) dbClient.close();
  if (server) server.close();
});
