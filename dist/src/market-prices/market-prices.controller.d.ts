import { MarketPricesService } from './market-prices.service';
export declare class MarketPricesController {
    private readonly marketPricesService;
    constructor(marketPricesService: MarketPricesService);
    findByDate(date: string, page?: string): Promise<{
        items: {
            date: string;
            category: string;
            name: string;
            average_price: number;
            unit: string;
        }[];
        pagination: {
            page: number;
            count: number;
            total: number;
        };
    }>;
    findByCategory(category: string, page?: string): Promise<{
        items: {
            date: string;
            category: string;
            name: string;
            average_price: number;
            unit: string;
        }[];
        pagination: {
            page: number;
            count: number;
            total: number;
        };
    }>;
    findByProduct(name: string, page?: string): Promise<{
        items: {
            date: string;
            category: string;
            name: string;
            average_price: number;
            unit: string;
        }[];
        pagination: {
            page: number;
            count: number;
            total: number;
        };
    }>;
    findMocPrices(date: string, categoryId?: string, type?: 'R' | 'W', start?: string, length?: string): Promise<{
        source: string;
        type: string;
        date: string;
        items: {
            id: string;
            name: string;
            price_range: string;
            average_price: number;
            unit: string;
        }[];
        pagination: {
            start: number;
            length: number;
            count: number;
            total: number;
        };
    }>;
}
