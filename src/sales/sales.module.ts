import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { ProductsModule } from '../products/products.module'; // Importamos productos para poder venderlos
import { Usuario } from '../users/entities/user.entity'; // Importamos usuario para el vendedor/comprador

@Module({
  imports: [
    // Registramos las entidades PROPIAS de este módulo
    TypeOrmModule.forFeature([Sale, SaleItem, Usuario]), 
    // Importamos ProductsModule para usar su repositorio y servicio exportado
    ProductsModule 
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}