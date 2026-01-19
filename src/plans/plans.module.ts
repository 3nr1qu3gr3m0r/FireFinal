import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plan.entity';
import { Class } from '../clases/entities/class.entity'; // 👈 Importante traer la entidad Class

@Module({
  // 👇 Registramos Plan y Class para que el servicio pueda usar ambos repositorios
  imports: [TypeOrmModule.forFeature([Plan, Class])], 
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService]
})
export class PlansModule {}