"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketPricesService = void 0;
const common_1 = require("@nestjs/common");
const AGRI_API_URL = 'https://agriapi.nabc.go.th/api/daily-prices';
const MOC_API_URL = 'https://mex.moc.go.th/page/dit/getcheckprice';
let MarketPricesService = class MarketPricesService {
    async request(path, page = 1) {
        try {
            const firstPage = await this.fetchPage(path, page);
            const records = [...firstPage.data];
            const limit = firstPage.pagination.limit || records.length || 100;
            const lastPage = Math.ceil(firstPage.pagination.total / limit);
            for (let currentPage = page + 1; currentPage <= lastPage; currentPage += 1) {
                const nextPage = await this.fetchPage(path, currentPage);
                records.push(...nextPage.data);
            }
            const grouped = new Map();
            for (const item of records) {
                const key = `${item.product_category}|${item.product_name}|${item.unit}`;
                const current = grouped.get(key);
                if (current) {
                    current.total += item.day_price;
                    current.count += 1;
                }
                else {
                    grouped.set(key, {
                        date: item.data_date,
                        category: item.product_category,
                        name: item.product_name,
                        unit: item.unit,
                        total: item.day_price,
                        count: 1,
                    });
                }
            }
            return {
                items: Array.from(grouped.values()).map((item) => ({
                    date: item.date,
                    category: item.category,
                    name: item.name,
                    average_price: Number((item.total / item.count).toFixed(2)),
                    unit: item.unit,
                })),
                pagination: {
                    page,
                    count: grouped.size,
                    total: grouped.size,
                },
            };
        }
        catch {
            throw new common_1.BadGatewayException('ไม่สามารถโหลดราคาสินค้าเกษตรได้');
        }
    }
    async fetchPage(path, page) {
        const separator = path.includes('?') ? '&' : '?';
        const response = await fetch(`${AGRI_API_URL}${path}${separator}page=${page}`, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) {
            throw new Error(`Agriculture API returned ${response.status}`);
        }
        return (await response.json());
    }
    findByDate(date, page = 1) {
        return this.request(`/date?date=${encodeURIComponent(date)}`, page);
    }
    findByCategory(category, page = 1) {
        return this.request(`/category?product_category=${encodeURIComponent(category)}`, page);
    }
    findByProduct(name, page = 1) {
        return this.request(`/product?product_name=${encodeURIComponent(name)}`, page);
    }
    async findMocPrices(date, categoryId = 2, type = 'R', start = 0, length = 25) {
        try {
            const form = new URLSearchParams({
                draw: '1',
                start: String(start),
                length: String(length),
                'order[0][column]': '1',
                'order[0][dir]': 'asc',
                'search[value]': '',
                'search[regex]': 'false',
                catid: String(categoryId),
                type,
                date,
            });
            const columns = ['NO', 'NAME', 'PRICE', 'AVG', 'UNIT', 'NAME'];
            columns.forEach((column, index) => {
                form.append(`columns[${index}][data]`, column);
                form.append(`columns[${index}][name]`, '');
                form.append(`columns[${index}][searchable]`, 'true');
                form.append(`columns[${index}][orderable]`, 'true');
                form.append(`columns[${index}][search][value]`, '');
                form.append(`columns[${index}][search][regex]`, 'false');
            });
            const response = await fetch(`${MOC_API_URL}/type/${type}/catid/${categoryId}`, {
                method: 'POST',
                body: form,
                signal: AbortSignal.timeout(10000),
                headers: {
                    Accept: 'application/json',
                    Referer: `https://mex.moc.go.th/page/dit/checkprice/type/${type}/catid/${categoryId}`,
                },
            });
            if (!response.ok) {
                throw new Error(`MOC API returned ${response.status}`);
            }
            const data = (await response.json());
            return {
                source: 'moc',
                type: type === 'R' ? 'retail' : 'wholesale',
                date,
                items: data.data.map((item) => ({
                    id: item.DT_RowId,
                    name: item.NAME,
                    price_range: item.PRICE,
                    average_price: Number.parseFloat(item.AVG),
                    unit: item.UNIT,
                })),
                pagination: {
                    start,
                    length,
                    count: data.recordsFiltered,
                    total: data.recordsTotal,
                },
            };
        }
        catch {
            throw new common_1.BadGatewayException('ไม่สามารถโหลดราคาสินค้าจากกระทรวงพาณิชย์ได้');
        }
    }
};
exports.MarketPricesService = MarketPricesService;
exports.MarketPricesService = MarketPricesService = __decorate([
    (0, common_1.Injectable)()
], MarketPricesService);
//# sourceMappingURL=market-prices.service.js.map