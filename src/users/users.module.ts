import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entities/user.entity';
import { UserPackage } from '../sales/entities/user-package.entity';
import { Sale } from '../sales/entities/sale.entity'; // 👈 Importante para las estadísticas

@Module({
  imports: [
    // 👇 Agregamos 'Sale' para poder inyectarlo en el servicio
    TypeOrmModule.forFeature([Usuario, UserPackage, Sale]), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}