import { IsNotEmpty, IsString, IsNumber, Min, Max, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  studentName: string;

  // Tu servicio espera .date, así que lo llamamos date
  @IsISO8601({}, { message: 'La fecha debe ser formato YYYY-MM-DD' })
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999)
  @Type(() => Number)
  contractTotal: number;
}