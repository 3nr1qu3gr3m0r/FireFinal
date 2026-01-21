// File: backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entities/user.entity';
// 👇 1. IMPORTA LA ENTIDAD DE PAQUETES (Verifica que la ruta sea correcta según tu estructura)
import { UserPackage } from '../sales/entities/user-package.entity'; 

@Module({
  imports: [
    // 👇 2. AGRÉGALA AQUÍ (Es lo que te falta)
    TypeOrmModule.forFeature([Usuario, UserPackage]), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}