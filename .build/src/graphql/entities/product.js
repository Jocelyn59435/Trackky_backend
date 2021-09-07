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
exports.Product = void 0;
const type_graphql_1 = require("type-graphql");
const product_status_1 = require("./enum/product_status");
const type_graphql_2 = require("type-graphql");
type_graphql_2.registerEnumType(product_status_1.productStatus, {
    name: 'productStatus', // this one is mandatory
});
let Product = class Product {
};
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], Product.prototype, "product_image_src", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], Product.prototype, "platform", void 0);
__decorate([
    type_graphql_1.Field((type) => product_status_1.productStatus),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field((type) => String),
    __metadata("design:type", String)
], Product.prototype, "user_id", void 0);
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.Float),
    __metadata("design:type", Number)
], Product.prototype, "original_price", void 0);
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.Float),
    __metadata("design:type", Number)
], Product.prototype, "current_price", void 0);
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.Float),
    __metadata("design:type", Number)
], Product.prototype, "desired_price", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Product.prototype, "price_update_time", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Product.prototype, "email_sent_time", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
Product = __decorate([
    type_graphql_1.ObjectType({ description: 'type definition for product' })
], Product);
exports.Product = Product;
//# sourceMappingURL=product.js.map