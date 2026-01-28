import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
      // 👇 Recibimos JSON: { contenido: "...", imagen_url: "..." }
      @Body() body: { contenido: string; imagen_url?: string }, 
      @Req() req
  ) {
      return this.service.create(body.contenido, body.imagen_url, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
      return this.service.remove(id, req.user);
  }
}