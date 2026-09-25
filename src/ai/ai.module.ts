import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketPricesModule } from '../market-prices/market-prices.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [PrismaModule, MarketPricesModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
