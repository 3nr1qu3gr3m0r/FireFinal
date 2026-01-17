import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';

@Module({
  imports: [
    // Aquí registramos la entidad para que TypeORM sepa que existe
    TypeOrmModule.forFeature([Usuario]), 
  ],
  providers: [],
  exports: [TypeOrmModule], // Exportamos para que AuthModule pueda usar el repositorio
})
export class UsersModule {}