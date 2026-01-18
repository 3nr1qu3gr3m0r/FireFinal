import { IsString, IsNumber, IsArray, ValidateNested, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoPago, TipoVenta } from '../entities/sale.entity';

class SaleItemDto {
  @IsNumber()
  producto_id: number;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsEnum(MetodoPago)
  metodo_pago: MetodoPago;

  // 🔹 Opcional: El folio de la transferencia o ID de MercadoPago
  @IsOptional()
  @IsString()
  referencia_externa?: string;

  // 🔹 Opcional: Por defecto será TIENDA, pero preparamos el terreno
  @IsOptional()
  @IsEnum(TipoVenta)
  tipo_venta?: TipoVenta;

  @IsOptional()
  @IsNumber()
  comprador_id?: number;

  @IsOptional()
  @IsString()
  nombre_externo?: string;
}