import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
// 👇 Importamos las entidades con las que se relaciona
import { Plan } from '../plans/entities/plan.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';

@Module({
  // 👇 Agregamos Plan y SaleItem aquí
  imports: [TypeOrmModule.forFeature([Class, Plan, SaleItem])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}