import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto) {
    // Aquí podrías validar que req.user.id sea igual a createBookingDto.usuario_id
    // si quieres evitar que un alumno reserve por otro (a menos que sea admin).
    return this.bookingsService.create(createBookingDto);
  }

  @Get('student/:id')
  @UseGuards(JwtAuthGuard)
  findByStudent(@Param('id') id: string) {
    return this.bookingsService.findAllByStudent(+id);
  }
}