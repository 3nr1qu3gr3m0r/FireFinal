import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar TypeOrmModule
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../users/entities/user.entity'; // 2. Importar la Entidad Usuario

@Module({
  imports: [
    // 3. ¡ESTA LÍNEA FALTABA!
    // Le dice a este módulo: "Oye, vas a necesitar acceder a la tabla de Usuarios"
    TypeOrmModule.forFeature([Usuario]), 
    
    JwtModule.register({
      global: true,
      secret: 'SECRETO_SUPER_SEGURO', 
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModule],
})
export class AuthModule {}