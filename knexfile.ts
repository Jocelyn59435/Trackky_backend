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

// function getConnection() {
//   if (process.env.DATABASE_USE_SSL) {
//     return process.env.DATABASE_URL + '?ssl=true';
//   }
//   return process.env.DATABASE_URL;
// }

const connection = process.env.DATABASE_URL + '?ssl=true';
const config = {
  client: 'pg',
  connection: connection,
  debug:
    process.env.DEBUG_KNEX && process.env.DEBUG_KNEX.toLowerCase() !== 'false',
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

module.exports = config;
