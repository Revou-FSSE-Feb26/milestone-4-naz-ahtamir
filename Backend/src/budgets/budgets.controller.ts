import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('api/budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(userId, createBudgetDto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: number,
    @Query('month', ParseIntPipe) month?: number,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return this.budgetsService.findAll(userId, month, year);
  }

  @Get('summary')
  getSummary(
    @CurrentUser('id') userId: number,
    @Query('month', ParseIntPipe) month?: number,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return this.budgetsService.getBudgetSummary(userId, month, year);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.budgetsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() updateBudgetDto: UpdateBudgetDto
  ) {
    return this.budgetsService.update(id, userId, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.budgetsService.remove(id, userId);
  }
}
