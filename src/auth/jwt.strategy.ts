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

  // Esto se ejecuta si el token es válido
  async validate(payload: any) {
    // Lo que retornes aquí se inyecta en req.user
    return { id: payload.sub, correo: payload.correo, rol: payload.rol };
  }
}