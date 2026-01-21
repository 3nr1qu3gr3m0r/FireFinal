import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { Badge } from './entities/badge.entity';
import { Usuario } from '../users/entities/user.entity'; // 1. Importar Usuario

@Module({
  // 2. AGREGAR Usuario AL ARRAY
  imports: [TypeOrmModule.forFeature([Badge, Usuario])], 
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService]
})
export class BadgesModule {}