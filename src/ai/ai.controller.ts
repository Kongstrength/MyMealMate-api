import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { RecommendMenuDto } from './dto/recommend-menu.dto';
import { SaveMealPlanDto } from './dto/save-meal-plan.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend-menu')
  recommendMenu(
    @Req() request: AuthenticatedRequest,
    @Body() dto: RecommendMenuDto,
  ) {
    return this.aiService.recommendMenu(
      request.user.sub,
      dto.budget,
      dto.meals_count ?? 3,
      dto.preferences,
    );
  }

  @Post('save-meal-plan')
  saveMealPlan(
    @Req() request: AuthenticatedRequest,
    @Body() dto: SaveMealPlanDto,
  ) {
    return this.aiService.saveMealPlan(request.user.sub, dto.meals, dto.date);
  }
}
