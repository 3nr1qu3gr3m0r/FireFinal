import { IsNotEmpty, IsNumber, Min, Max, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddPaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999)
  @Type(() => Number)
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  conceptId: string; // 'general' o el ID numérico como string
}