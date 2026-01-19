import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateLevelDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre del nivel es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El color es obligatorio.' })
  // 👇 Validación estricta de color HEX
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'El color debe ser un código hexadecimal válido (ej: #FF0000)' 
  })
  color: string;
}