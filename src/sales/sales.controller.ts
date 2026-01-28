import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Req, 
  UseGuards, 
  ForbiddenException, 
  Param, 
  Delete, 
  Patch,
  ParseIntPipe // 👈 Agregado para validar el ID numérico
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // --- CREAR VENTA (Registrar) ---
  @Post()
  @UseGuards(JwtAuthGuard) 
  create(@Body() createSaleDto: CreateSaleDto, @Req() req) {
    const userRole = req.user.rol; // "rol" viene del JwtStrategy

    if (userRole !== 'admin' && userRole !== 'recepcionista') {
      throw new ForbiddenException('No tienes permisos para registrar ventas.');
    }
    
    return this.salesService.create(createSaleDto, req.user);
  }

  // --- VER HISTORIAL DE VENTAS ---
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    const userRole = req.user.rol;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Acceso denegado. Solo el administrador puede ver el historial de ventas.');
    }

    return this.salesService.findAll();
  }

  // 👇 --- NUEVO: CANCELAR PAQUETE (SOLO ADMIN) --- 👇
  @Delete('packages/:id')
  @UseGuards(JwtAuthGuard)
  cancelPackage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    // 1. Validación Estricta de Rol
    if (req.user.rol !== 'admin') {
        throw new ForbiddenException('SOLO el administrador puede cancelar/eliminar paquetes.');
    }

    // 2. Llamada al servicio pasando el usuario para auditoría
    return this.salesService.cancelPackage(id, req.user);
  }

  // --- MODIFICAR VENTA ---
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any, @Req() req) {
    if (req.user.rol !== 'admin') {
        throw new ForbiddenException('Solo el administrador puede modificar ventas.');
    }
    return { message: 'Función de actualización reservada para Admin' };
  }

  // --- ELIMINAR VENTA COMPLETA ---
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.rol !== 'admin') {
        throw new ForbiddenException('Solo el administrador puede eliminar ventas.');
    }
    return { message: 'Venta eliminada (simulado, implementar en servicio)' };
  }
}