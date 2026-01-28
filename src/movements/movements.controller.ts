import { 
  Controller, 
  Get, 
  Post,   // 👈 Faltaba esto
  Body,   // 👈 Faltaba esto
  Delete, 
  Query, 
  Param, 
  UseGuards, 
  Req, 
  ParseIntPipe 
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('movements')
@UseGuards(JwtAuthGuard)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  // --- OBTENER MOVIMIENTOS (FILTRO POR FECHA) ---
  @Get()
  findAll(@Query('start') start: string, @Query('end') end: string) {
    const now = new Date();
    // Si no envían fechas, usamos el mes actual por defecto
    const defaultStart = start || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const defaultEnd = end || new Date().toISOString();
    
    return this.movementsService.findAll(defaultStart, defaultEnd);
  }

  // --- REGISTRAR NUEVO MOVIMIENTO ---
  @Post()
  create(@Body() createDto: any, @Req() req) {
    // createDto trae: { monto, descripcion, tipo: 'ingreso' | 'egreso' }
    return this.movementsService.create(createDto, req.user);
  }

  // --- ELIMINAR MOVIMIENTO (Solo Admin) ---
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.movementsService.remove(id, req.user.rol);
  }
}