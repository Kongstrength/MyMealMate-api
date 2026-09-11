import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RecipesModule } from './recipes/recipes.module';
import { MealPlanModule } from './meal-plan/meal-plan.module';

@Module({
  imports: [UsersModule, DashboardModule, RecipesModule, MealPlanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
