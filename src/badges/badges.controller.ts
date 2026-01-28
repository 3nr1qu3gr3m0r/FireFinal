import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { AssignBadgesDto } from './dto/assign-badges.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('badges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @Roles('admin')
  create(
    @Body() createBadgeDto: CreateBadgeDto,
    @Request() req: any 
  ) {
    // req.user viene del JwtStrategy y trae { id, nombre, rol, ... }
    return this.badgesService.create(createBadgeDto, req.user);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Post('assign')
  @Roles('admin')
  assignBadges(@Body() assignBadgesDto: AssignBadgesDto) {
    return this.badgesService.assignBadges(assignBadgesDto);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBadgeDto: UpdateBadgeDto,
    @Request() req: any
  ) {
    return this.badgesService.update(id, updateBadgeDto, req.user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.badgesService.remove(id, req.user);
  }
}