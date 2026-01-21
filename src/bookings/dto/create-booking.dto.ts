import { IsInt, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  clase_id: number;

  @IsInt()
  usuario_id: number; // El alumno que va a tomar la clase

  @IsDateString()
  fecha_clase: string; // Formato YYYY-MM-DD
}