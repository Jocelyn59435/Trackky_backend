"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
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
//# sourceMappingURL=knexfile.js.map