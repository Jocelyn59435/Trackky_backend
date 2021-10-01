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
    password: 'internet',
    database: POSTGRES_DB,
  },
  ssl: {
    rejectUnauthorized: false,
  },
};

// const config = {
//   client: 'pg',
//   // PG database endpoint from Heroku
//   connection: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

// module.exports = config;
