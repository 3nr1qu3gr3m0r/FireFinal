import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @IsNotEmpty()
  nombre: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(1, { message: 'El precio debe ser mayor a 0' })
  @Type(() => Number)
  precio: number;

  @IsNumber()
  @Min(1, { message: 'La vigencia debe ser de al menos 1 día' })
  @Type(() => Number)
  vigencia_dias: number;

  @IsNumber()
  @Min(1, { message: 'La cantidad de clases debe ser al menos 1' })
  @Type(() => Number)
  cantidad_clases: number;

  // 🔗 Recibimos un array de IDs de clases [1, 2, 5]
  @IsArray({ message: 'Debes seleccionar las clases incluidas' })
  @ArrayMinSize(1, { message: 'El plan debe incluir al menos una clase' })
  clasesIds: number[];
}