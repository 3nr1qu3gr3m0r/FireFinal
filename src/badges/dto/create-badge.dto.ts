import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la insignia es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'El color debe ser un código hexadecimal válido.' 
  })
  color: string;

  @IsOptional()
  @IsString()
  imagen?: string; // Es opcional
}