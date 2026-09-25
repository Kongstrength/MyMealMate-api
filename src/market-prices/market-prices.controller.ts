import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';

@Controller('market-prices')
export class MarketPricesController {
  constructor(private readonly marketPricesService: MarketPricesService) {}

  @Get('date')
  findByDate(@Query('date') date: string, @Query('page') page = '1') {
    if (!date) {
      throw new BadRequestException('date is required');
    }

    return this.marketPricesService.findByDate(date, Number(page));
  }

  @Get('category')
  findByCategory(
    @Query('category') category: string,
    @Query('page') page = '1',
  ) {
    if (!category) {
      throw new BadRequestException('category is required');
    }

    return this.marketPricesService.findByCategory(category, Number(page));
  }

  @Get('product')
  findByProduct(@Query('name') name: string, @Query('page') page = '1') {
    if (!name) {
      throw new BadRequestException('name is required');
    }

    return this.marketPricesService.findByProduct(name, Number(page));
  }

  @Get('moc')
  findMocPrices(
    @Query('date') date: string,
    @Query('categoryId') categoryId = '2',
    @Query('type') type: 'R' | 'W' = 'R',
    @Query('start') start = '0',
    @Query('length') length = '25',
  ) {
    if (!date) {
      throw new BadRequestException('date is required');
    }

    if (type !== 'R' && type !== 'W') {
      throw new BadRequestException('type must be R or W');
    }

    return this.marketPricesService.findMocPrices(
      date,
      Number(categoryId),
      type,
      Number(start),
      Number(length),
    );
  }
}
