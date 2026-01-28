import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

// Entidades
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { UserPackage } from './entities/user-package.entity';
import { Usuario } from '../users/entities/user.entity';
import { Producto } from '../products/entities/product.entity';
import { Class } from '../clases/entities/class.entity'; 
import { Plan } from '../plans/entities/plan.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale, 
      SaleItem, 
      Usuario, 
      UserPackage, 
      Producto, 
      Class, 
      Plan
    ]), 
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}