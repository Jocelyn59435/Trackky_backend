/* eslint-disable @typescript-eslint/no-var-requires */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

// const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
//   process.env;

// module.exports = {
//   client: 'pg',
//   connection: {
//     host: POSTGRES_HOST,
//     user: POSTGRES_USER,
//     password: POSTGRES_PASSWORD,
//     database: POSTGRES_DB,
//   },
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

const connection = process.env.DATABASE_URL;
const config = {
  client: 'pg',
  connection: connection,
  ssl: {
    rejectUnauthorized: false,
  },
};

module.exports = config;
