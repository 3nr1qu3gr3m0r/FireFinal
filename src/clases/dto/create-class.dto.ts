import { IsString, IsNotEmpty, IsEnum, IsNumber, Matches, Min, IsOptional } from 'class-validator';
import { NivelClase } from '../entities/class.entity';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'El maestro es obligatorio' })
  maestro: string;

  // 💰 VALIDACIÓN DE PRECIO
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(1, { message: 'El precio de la clase debe ser al menos $1.00' })
  @Type(() => Number) // Convierte "500" (string) a 500 (number) antes de validar
  precio: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe ser YYYY-MM-DD' })
  fecha_inicio: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsEnum(NivelClase, { message: 'Nivel no válido' })
  nivel: NivelClase;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dias_repeticion: number;

  @IsOptional()
  @IsString()
  imagen?: string;
}