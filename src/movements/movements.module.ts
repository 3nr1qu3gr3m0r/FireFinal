// src/movements/movements.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]), // 👈 Importante: Registra la entidad aquí
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService] // Opcional, por si otros módulos lo necesitan
})
export class MovementsModule {}