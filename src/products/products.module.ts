import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Producto } from './entities/product.entity';

@Module({
  imports: [
    // 1. Registramos la Entidad para usar Repository<Producto>
    TypeOrmModule.forFeature([Producto]) 
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  // 2. EXPORTAMOS TypeOrmModule para que 'SalesModule' pueda usar Repository<Producto>
  exports: [TypeOrmModule, ProductsService], 
})
export class ProductsModule {}