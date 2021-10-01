"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_errors_1 = require("apollo-server-errors");
dotenv_1.default.config();
//non-null-assertion
const tokensecret = process.env.TOKEN_SECRET;
const authChecker = async ({ root, args, context, info, }) => {
    const { db, req } = context;
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new apollo_server_errors_1.AuthenticationError('Invalid request. ' + authorizationHeader);
    }
    const token = authorizationHeader.split(' ')[1];
    const data = jsonwebtoken_1.default.verify(token, tokensecret);
    const [user] = await db('user_info').where('email', data.email);
    if (!user) {
        throw new apollo_server_errors_1.AuthenticationError('User not found.');
    }
    return true;
};
exports.authChecker = authChecker;
//# sourceMappingURL=verifyAuthToken.js.map