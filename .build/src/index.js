"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const config = __importStar(require("../knexfile"));
const knex_1 = __importDefault(require("knex"));
const scrapeProduct_1 = require("./utils/scrapeProduct");
const user_info_resolver_1 = require("./graphql/resolvers/user_info_resolver");
const product_resolver_1 = require("./graphql/resolvers/product_resolver");
const auth_resolver_1 = require("./graphql/resolvers/auth_resolver");
const verifyAuthToken_1 = require("./middlewares/verifyAuthToken");
const PORT = process.env.PORT || 4000;
const schema = type_graphql_1.buildSchemaSync({
    resolvers: [user_info_resolver_1.User_info_Resolver, product_resolver_1.Product_Resolver, auth_resolver_1.Auth_Resolver],
    authChecker: verifyAuthToken_1.authChecker,
});
const app = express_1.default();
exports.db = knex_1.default(config);
const server = new apollo_server_express_1.ApolloServer({
    schema,
    context: ({ req, res }) => {
        return {
            req,
            res,
            db: exports.db,
        };
    },
    introspection: true,
    playground: true,
});
server.applyMiddleware({ app });
scrapeProduct_1.scrapeProduct('https://www.chemistwarehouse.com.au/buy/99343/l-39-oreal-paris-revitalift-filler-hyaluronic-acid-anti-wrinkle-serum-30ml');
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
//# sourceMappingURL=index.js.map