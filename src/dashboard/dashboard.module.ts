import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MealPlanModule } from '../meal-plan/meal-plan.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [PrismaModule, MealPlanModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
