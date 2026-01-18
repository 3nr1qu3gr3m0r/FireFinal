import { IsString, IsNumber, IsIn, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  // 1. Transformamos a Número por si llega como string del input
  @Type(() => Number) 
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  // 2. Validación de rango (Mínimo 1 peso, Máximo razonable)
  @Min(0.5, { message: 'El precio debe ser al menos $0.50' }) 
  @Max(99999, { message: 'Precio demasiado alto' })
  precio: number;

  @IsString()
  @IsIn(['academia', 'sens'], { message: 'Tienda no válida' })
  tienda: string;
}