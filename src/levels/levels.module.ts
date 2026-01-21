import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { Level } from './entities/level.entity';
import { Usuario } from '../users/entities/user.entity'; // 👈 IMPORTANTE

@Module({
  imports: [TypeOrmModule.forFeature([Level, Usuario])], // 👈 AGREGA USUARIO AQUÍ
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService]
})
export class LevelsModule {}