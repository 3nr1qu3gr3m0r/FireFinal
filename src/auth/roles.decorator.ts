import { SetMetadata } from '@nestjs/common';

// Esta clave servirá para leer los metadatos luego
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);