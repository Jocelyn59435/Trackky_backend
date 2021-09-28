import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import * as config from '../knexfile';
import Knex from 'knex';
import { scrapeProduct } from './utils/scrapeProduct';
import { User_info_Resolver } from './graphql/resolvers/user_info_resolver';
import { Product_Resolver } from './graphql/resolvers/product_resolver';
import { Auth_Resolver } from './graphql/resolvers/auth_resolver';
import { authChecker } from './middlewares/verifyAuthToken';

const PORT = process.env.PORT || 4000;

const schema = buildSchemaSync({
  resolvers: [User_info_Resolver, Product_Resolver, Auth_Resolver],
  authChecker: authChecker,
});

const app = express();

export const db = Knex(config);

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

scrapeProduct(
  'https://www.chemistwarehouse.com.au/buy/99343/l-39-oreal-paris-revitalift-filler-hyaluronic-acid-anti-wrinkle-serum-30ml'
);

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
});
