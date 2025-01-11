import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const connection = new Sequelize({
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT as Dialect,
  logging: process.env.DB_LOGGING === 'false',
  models: [`${__dirname}/../models/**.ts`],
});
