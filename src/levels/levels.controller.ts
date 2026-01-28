import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AssignLevelDto } from './dto/assign-level.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('levels')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Bloqueo general
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createLevelDto: CreateLevelDto, @Request() req: any) {
    return this.levelsService.create(createLevelDto, req.user);
  }

  @Get()
  // Si los alumnos necesitan ver los niveles, quita @Roles('admin') de aquí.
  findAll() {
    return this.levelsService.findAll();
  }

  @Post('assign')
  @Roles('admin')
  assignLevel(@Body() assignLevelDto: AssignLevelDto) {
    return this.levelsService.assignLevel(assignLevelDto);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLevelDto: UpdateLevelDto,
    @Request() req: any
  ) {
    return this.levelsService.update(id, updateLevelDto, req.user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.levelsService.remove(id, req.user);
  }
}