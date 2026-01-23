import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plan.entity';
import { Class } from '../clases/entities/class.entity'; // 👈 Importamos entidad Clase

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Class]) // 👈 Registramos ambas
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService], // Exportamos por si Ventas lo necesita
})
export class PlansModule {}