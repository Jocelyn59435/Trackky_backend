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
exports.AddProductPayload = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const product_status_1 = require("../entities/enum/product_status");
const type_graphql_2 = require("type-graphql");
type_graphql_2.registerEnumType(product_status_1.productStatus, {
    name: 'productStatus', // this one is mandatory
});
let AddProductPayload = class AddProductPayload {
};
__decorate([
    type_graphql_1.Field((type) => String),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AddProductPayload.prototype, "product_link", void 0);
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.Float),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], AddProductPayload.prototype, "desired_price", void 0);
AddProductPayload = __decorate([
    type_graphql_1.InputType()
], AddProductPayload);
exports.AddProductPayload = AddProductPayload;
//# sourceMappingURL=AddProductPayload.js.map