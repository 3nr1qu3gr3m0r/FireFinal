import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { AssignBadgesDto } from './dto/assign-badges.dto'; // 👈 Importar
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(createBadgeDto);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard)
  assignBadges(@Body() assignBadgesDto: AssignBadgesDto) {
    return this.badgesService.assignBadges(assignBadgesDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}