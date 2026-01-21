import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AssignLevelDto } from './dto/assign-level.dto'; // 👈 IMPORTAR
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  findAll() {
    return this.levelsService.findAll();
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard) // Proteger ruta
  assignLevel(@Body() assignLevelDto: AssignLevelDto) {
    return this.levelsService.assignLevel(assignLevelDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelsService.remove(id);
  }
}