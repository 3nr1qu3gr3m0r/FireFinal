import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plan.entity';
// Verifica la ruta de Class según tu carpeta real ('classes' o 'clases')
import { Class } from '../clases/entities/class.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Class])], 
  controllers: [PlansController],
  providers: [PlansService],
  exports: [TypeOrmModule] // 👈 ¡ESTO ES CRÍTICO! Permite usar PlanRepository en otros módulos
})
export class PlansModule {}