import { IsEmail, IsString, MinLength, IsOptional, IsDateString, Matches } from 'class-validator';

export class RegistroDto {
  // 1. Cambio: nombre -> nombre_completo
  @IsString()
  @MinLength(3)
  // 2. NUEVO: Esta expresión regular solo permite Letras (Mayus/Minus), Tildes, Ñ y Espacios
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  nombre_completo: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  // 2. Cambio: Agregamos el rol (opcional)
  @IsString()
  @IsOptional()
  rol?: string; // 'admin' | 'alumno' | 'recepcionista'

  // --- RESTO DE CAMPOS OPCIONALES (Para el Admin Panel) ---
  @IsOptional()
  @IsString() // Usamos string para simplificar la entrada de fecha desde JSON
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsString()
  emergencia_nombre?: string;

  @IsOptional()
  @IsString()
  emergencia_parentesco?: string;

  @IsOptional()
  @IsString()
  emergencia_telefono?: string;

  @IsOptional()
  @IsString()
  informacion_medica?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}

export class LoginDto {
  // 3. Cambio: correo -> identificador
  @IsString()
  identificador: string; // Acepta email O id numérico

  @IsString()
  contrasena: string;
}