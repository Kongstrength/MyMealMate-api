import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { UpsertMealPlanDto } from './dto/upsert-meal-plan.dto';
import { MealPlanService } from './meal-plan.service';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Get('range')
  findByRange(
    @Req() request: AuthenticatedRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.mealPlanService.findByRange(request.user.sub, from, to);
  }

  @Get()
  findByDate(
    @Req() request: AuthenticatedRequest,
    @Query('date') date?: string,
  ) {
    return this.mealPlanService.findByDate(request.user.sub, date);
  }

  @Put()
  upsert(
    @Req() request: AuthenticatedRequest,
    @Query('date') date: string,
    @Body() dto: UpsertMealPlanDto,
  ) {
    return this.mealPlanService.upsert(request.user.sub, date, dto);
  }

  @Delete(':id')
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.mealPlanService.delete(request.user.sub, id);
  }
}
