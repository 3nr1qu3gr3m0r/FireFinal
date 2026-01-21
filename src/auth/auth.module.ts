import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // 👈 IMPORTANTE: Faltaba esto
import { ConfigModule, ConfigService } from '@nestjs/config'; // Recomendado para no hardcodear secretos

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../users/entities/user.entity';
import { JwtStrategy } from './jwt.strategy'; // 👈 Crearemos esto en el paso 2

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule, // 👈 Registra Passport
    
    // Configuración JWT Mejorada (Usando variables de entorno o fallback)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'SECRETO_SUPER_SEGURO',
        signOptions: { expiresIn: '365d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 ¡CLAVE! Sin esto, el Guard falla
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}