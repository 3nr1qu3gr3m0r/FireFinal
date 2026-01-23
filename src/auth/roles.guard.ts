import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene roles requeridos, dejamos pasar
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos el usuario del request (inyectado por JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // Validamos: ¿Existe el usuario? ¿Tiene rol? ¿Su rol está permitido?
    // NOTA: Asegúrate de que tu JWT Strategy devuelve el campo 'rol'
    if (!user || !user.rol || !requiredRoles.includes(user.rol)) {
        throw new ForbiddenException('No tienes permisos suficientes (Se requiere: ' + requiredRoles.join(', ') + ')');
    }

    return true;
  }
}