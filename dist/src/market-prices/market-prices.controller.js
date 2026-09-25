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
exports.MarketPricesController = void 0;
const common_1 = require("@nestjs/common");
const market_prices_service_1 = require("./market-prices.service");
let MarketPricesController = class MarketPricesController {
    marketPricesService;
    constructor(marketPricesService) {
        this.marketPricesService = marketPricesService;
    }
    findByDate(date, page = '1') {
        if (!date) {
            throw new common_1.BadRequestException('date is required');
        }
        return this.marketPricesService.findByDate(date, Number(page));
    }
    findByCategory(category, page = '1') {
        if (!category) {
            throw new common_1.BadRequestException('category is required');
        }
        return this.marketPricesService.findByCategory(category, Number(page));
    }
    findByProduct(name, page = '1') {
        if (!name) {
            throw new common_1.BadRequestException('name is required');
        }
        return this.marketPricesService.findByProduct(name, Number(page));
    }
    findMocPrices(date, categoryId = '2', type = 'R', start = '0', length = '25') {
        if (!date) {
            throw new common_1.BadRequestException('date is required');
        }
        if (type !== 'R' && type !== 'W') {
            throw new common_1.BadRequestException('type must be R or W');
        }
        return this.marketPricesService.findMocPrices(date, Number(categoryId), type, Number(start), Number(length));
    }
};
exports.MarketPricesController = MarketPricesController;
__decorate([
    (0, common_1.Get)('date'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketPricesController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)('category'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketPricesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('product'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketPricesController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Get)('moc'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('start')),
    __param(4, (0, common_1.Query)('length')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], MarketPricesController.prototype, "findMocPrices", null);
exports.MarketPricesController = MarketPricesController = __decorate([
    (0, common_1.Controller)('market-prices'),
    __metadata("design:paramtypes", [market_prices_service_1.MarketPricesService])
], MarketPricesController);
//# sourceMappingURL=market-prices.controller.js.map