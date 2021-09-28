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
exports.Auth_Resolver = exports.AuthResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Auth_1 = require("../types/Auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
//non-null-assertion
const tokensecret = process.env.TOKEN_SECRET;
let AuthResponse = class AuthResponse {
};
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], AuthResponse.prototype, "token", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], AuthResponse.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], AuthResponse.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], AuthResponse.prototype, "email", void 0);
AuthResponse = __decorate([
    type_graphql_1.ObjectType()
], AuthResponse);
exports.AuthResponse = AuthResponse;
let Auth_Resolver = class Auth_Resolver {
    async signUp(input, ctx) {
        const { db } = ctx;
        //use bcrypt to hash password
        const hashedPassword = await bcrypt_1.default.hash(input.password, 10);
        const email = input.email.toLowerCase();
        //validate user input
        const existingEmail = await db('user_info').where('email', email);
        if (existingEmail.length) {
            throw new apollo_server_express_1.ApolloError(`This email address has been registered: ${email}`);
        }
        // insert data to database
        const [user] = await db('user_info')
            .insert({ ...input, password: hashedPassword })
            .returning('*');
        const token = jsonwebtoken_1.default.sign({ email: input.email }, tokensecret);
        return {
            token,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
    async signIn(input, ctx) {
        const { db } = ctx;
        const [user] = await db('user_info').where('email', input.email);
        if (!user) {
            throw new apollo_server_express_1.ApolloError(`Invalid email address: ${input.email}`);
        }
        const isValidPassword = bcrypt_1.default.compareSync(input.password, user.password);
        if (!isValidPassword) {
            throw new apollo_server_express_1.ApolloError(`Invalid credentials.`);
        }
        const token = jsonwebtoken_1.default.sign({ email: input.email }, tokensecret);
        return {
            token,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
    async resetPassword(email, passwordInput, ctx) {
        const { db } = ctx;
        const [{ updatedAccount }] = await db('user_info')
            .where('email', email)
            .update({ password: passwordInput }, ['email']);
        if (!updatedAccount) {
            throw new apollo_server_express_1.ApolloError(`Invalid email address: ${email}`);
        }
        return updatedAccount;
    }
};
__decorate([
    type_graphql_1.Mutation(() => AuthResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Auth_1.SignUpPayload, Object]),
    __metadata("design:returntype", Promise)
], Auth_Resolver.prototype, "signUp", null);
__decorate([
    type_graphql_1.Mutation(() => AuthResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Auth_1.SignInPayload, Object]),
    __metadata("design:returntype", Promise)
], Auth_Resolver.prototype, "signIn", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('passwordInput')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], Auth_Resolver.prototype, "resetPassword", null);
Auth_Resolver = __decorate([
    type_graphql_1.Resolver()
], Auth_Resolver);
exports.Auth_Resolver = Auth_Resolver;
//# sourceMappingURL=auth_resolver.js.map