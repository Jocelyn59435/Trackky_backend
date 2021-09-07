/* eslint-disable @typescript-eslint/no-var-requires */

import dotenv from 'dotenv';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
  process.env;

module.exports = {
  client: 'pg',
  connection: {
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  },
  ssl: {
    rejectUnauthorized: false,
  },
};
