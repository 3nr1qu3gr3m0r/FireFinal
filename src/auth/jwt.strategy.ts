import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lee "Bearer eyJhbG..."
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'SECRETO_SUPER_SEGURO', // Debe ser igual al del Module
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      correo: payload.correo, 
      rol: payload.rol,
      nombre: payload.nombre // 👈 Ahora sí lo leemos del token
    };
  }
}