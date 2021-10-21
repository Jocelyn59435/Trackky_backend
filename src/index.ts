import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import * as config from '../knexfile';
import Knex from 'knex';
import { User_info_Resolver } from './graphql/resolvers/user_info_resolver';
import { Product_Resolver } from './graphql/resolvers/product_resolver';
import { Auth_Resolver } from './graphql/resolvers/auth_resolver';
import { authChecker } from './middlewares/verifyAuthToken';
import cron from 'node-cron';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import updateAllProducts from './utils/updateAllProducts';
import EventEmitter from 'events';

const PORT = process.env.PORT || 4000;
const emitter = new EventEmitter();
emitter.setMaxListeners(100);

const schema = buildSchemaSync({
  resolvers: [User_info_Resolver, Product_Resolver, Auth_Resolver],
  authChecker: authChecker,
});

const app = express();

export const db = Knex(config);

// update all product's current price every one minute
//cron.schedule('*/1 * * * *', updateAllProducts);

// update all product's current price every five hours
cron.schedule('* * /5 * * *', updateAllProducts);

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return {
      req,
      res,
      db,
    };
  },
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
});
