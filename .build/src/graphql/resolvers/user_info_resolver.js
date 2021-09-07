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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_info_Resolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_info_1 = require("../entities/user_info");
let User_info_Resolver = class User_info_Resolver {
    async getUserInfo(email, ctx) {
        const { db } = ctx;
        const [user_info] = await db('user_info')
            .where('email', email)
            .columns('*');
        return user_info;
    }
};
__decorate([
    type_graphql_1.Query(() => user_info_1.User_info),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], User_info_Resolver.prototype, "getUserInfo", null);
User_info_Resolver = __decorate([
    type_graphql_1.Resolver()
], User_info_Resolver);
exports.User_info_Resolver = User_info_Resolver;
//# sourceMappingURL=user_info_resolver.js.map