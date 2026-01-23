import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Producto } from './entities/product.entity';
// 👇 Importamos SaleItem
import { SaleItem } from '../sales/entities/sale-item.entity';

@Module({
  // 👇 Lo agregamos aquí
  imports: [TypeOrmModule.forFeature([Producto, SaleItem])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}