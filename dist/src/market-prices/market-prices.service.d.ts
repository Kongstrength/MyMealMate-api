export declare class MarketPricesService {
    private request;
    private fetchPage;
    findByDate(date: string, page?: number): Promise<{
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
    findByCategory(category: string, page?: number): Promise<{
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
    findByProduct(name: string, page?: number): Promise<{
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
    findMocPrices(date: string, categoryId?: number, type?: 'R' | 'W', start?: number, length?: number): Promise<{
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
