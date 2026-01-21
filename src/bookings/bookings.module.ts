import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Class } from '../clases/entities/class.entity'; // 👈 Necesario
import { Usuario } from '../users/entities/user.entity';   // 👈 Necesario
import { UserPackage } from '../sales/entities/user-package.entity'; // 👈 Necesario

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Class, Usuario, UserPackage])
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {}