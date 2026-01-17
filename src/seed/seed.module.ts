import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Usuario } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // Importamos la tabla Usuarios
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}