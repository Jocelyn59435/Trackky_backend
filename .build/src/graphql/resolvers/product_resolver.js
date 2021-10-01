"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product_Resolver = void 0;
const type_graphql_1 = require("type-graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const product_1 = require("../entities/product");
const AddProductPayload_1 = require("../types/AddProductPayload");
const apollo_server_errors_1 = require("apollo-server-errors");
const scrapeProduct_1 = require("../../utils/scrapeProduct");
dotenv_1.default.config();
//non-null-assertion
const tokensecret = process.env.TOKEN_SECRET;
let Product_Resolver = class Product_Resolver {
    async getProductById(id, ctx) {
        const { db } = ctx;
        const [product] = await db('product').where('id', id).columns('*');
        return product;
    }
    async addProduct(input, ctx) {
        const { db, req } = ctx;
        //Scrape product info via the link
        const product_info = await scrapeProduct_1.scrapeProduct(input.product_link);
        // Get userId from token
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(' ')[1];
        // it is authorized, should have the valid token
        const { email } = jsonwebtoken_1.default.verify(token, tokensecret);
        const [user] = await db('user_info').where('email', email);
        const userId = user.id;
        const existingProduct = await db('product').where({
            user_id: userId,
            product_name: product_info.product_name,
        });
        if (existingProduct.length) {
            throw new apollo_server_errors_1.ApolloError(`This product has been added: ${product_info.product_name}`);
        }
        try {
            const [product] = await db('product')
                .insert({ ...product_info, ...input, user_id: userId })
                .returning('*');
            return product;
        }
        catch (e) {
            throw new apollo_server_errors_1.ApolloError(e.message);
        }
    }
    async deleteProduct(id, user_id, ctx) {
        const { db } = ctx;
        try {
            const [product] = await db('product').where({
                id: id,
                user_id: user_id,
            });
            if (!product) {
                throw new apollo_server_errors_1.ApolloError('Product not found.');
            }
            return await db('product')
                .where({
                id: id,
                user_id: user_id,
            })
                .del();
        }
        catch (e) {
            throw new apollo_server_errors_1.ApolloError(e.message);
        }
    }
};
__decorate([
    type_graphql_1.Query(() => product_1.Product),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], Product_Resolver.prototype, "getProductById", null);
__decorate([
    type_graphql_1.Mutation(() => product_1.Product),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddProductPayload_1.AddProductPayload, Object]),
    __metadata("design:returntype", Promise)
], Product_Resolver.prototype, "addProduct", null);
__decorate([
    type_graphql_1.Mutation(() => type_graphql_1.Int),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('user_id')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], Product_Resolver.prototype, "deleteProduct", null);
Product_Resolver = __decorate([
    type_graphql_1.Resolver()
], Product_Resolver);
exports.Product_Resolver = Product_Resolver;
//# sourceMappingURL=product_resolver.js.map