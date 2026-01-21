import { IsInt, IsNotEmpty, IsString, IsArray, ValidateNested, IsEnum, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Validamos los items individuales (Clases, Planes, Productos, Deudas)
export class CreateSaleItemDto {
  @IsString()
  @IsNotEmpty()
  // Ahora aceptamos 'deuda' también
  @IsEnum(['producto', 'clase', 'plan', 'inscripcion', 'deuda'], { message: 'El tipo de item no es válido' })
  tipo: 'producto' | 'clase' | 'plan' | 'inscripcion' | 'deuda';

  @IsInt()
  @IsNotEmpty()
  id_referencia: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  // 👇 NUEVOS CAMPOS (Opcionales) PARA QUE NO TE DE ERROR
  @IsOptional()
  @IsNumber()
  precio_final?: number; // Para manejar los descuentos o abonos manuales

  @IsOptional()
  @IsNumber()
  precio_acordado?: number;

  @IsOptional()
  @IsBoolean()
  es_plazo?: boolean; // Para saber si se genera deuda

  @IsOptional()
  @IsInt()
  usar_paquete_id?: number; // Para saber si se paga con un paquete existente
}

export class CreateSaleDto {
  @IsOptional()
  @IsInt()
  comprador_id?: number;

  @IsOptional()
  @IsString()
  nombre_externo?: string;

  @IsString()
  @IsNotEmpty()
  metodo_pago: string;

  @IsOptional()
  @IsString()
  referencia_externa?: string;

  @IsString()
  @IsNotEmpty()
  // 👇 AGREGAMOS 'mixta' A LA LISTA PERMITIDA
  @IsEnum(['tienda', 'paquete', 'clase', 'inscripcion', 'abono', 'mixta'], { 
    message: 'El tipo de venta debe ser: tienda, paquete, clase, inscripcion, abono o mixta' 
  })
  tipo_venta: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}