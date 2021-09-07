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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_info = void 0;
const type_graphql_1 = require("type-graphql");
let User_info = class User_info {
};
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], User_info.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], User_info.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], User_info.prototype, "created_at", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], User_info.prototype, "updated_at", void 0);
User_info = __decorate([
    type_graphql_1.ObjectType({ description: 'type definition for user_info' })
], User_info);
exports.User_info = User_info;
//# sourceMappingURL=user_info.js.map