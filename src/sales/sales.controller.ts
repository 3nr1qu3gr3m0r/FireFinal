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
  Patch 
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // --- CREAR VENTA (Registrar) ---
  // Permitido: Admin y Recepcionista
  @Post()
  @UseGuards(JwtAuthGuard) 
  create(@Body() createSaleDto: CreateSaleDto, @Req() req) {
    const userRole = req.user.rol;

    // Validamos que sea Admin o Recepcionista
    if (userRole !== 'admin' && userRole !== 'recepcionista') {
      throw new ForbiddenException('No tienes permisos para registrar ventas.');
    }
    
    // Pasamos el usuario (req.user contiene id, correo, rol gracias a JwtStrategy)
    return this.salesService.create(createSaleDto, req.user);
  }

  // --- VER HISTORIAL DE VENTAS ---
  // Permitido: SOLO Admin
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    const userRole = req.user.rol;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Acceso denegado. Solo el administrador puede ver el historial de ventas.');
    }

    return this.salesService.findAll();
  }

  // --- MODIFICAR VENTA (Opcional, si tienes el método en el servicio) ---
  // Permitido: SOLO Admin
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any, @Req() req) {
    if (req.user.rol !== 'admin') {
        throw new ForbiddenException('Solo el administrador puede modificar ventas.');
    }
    // Asegúrate de tener update en tu servicio si vas a usar esto
    // return this.salesService.update(+id, updateData);
    return { message: 'Función de actualización reservada para Admin' };
  }

  // --- ELIMINAR VENTA ---
  // Permitido: SOLO Admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.rol !== 'admin') {
        throw new ForbiddenException('Solo el administrador puede eliminar ventas.');
    }
    // Asegúrate de tener remove en tu servicio
    // return this.salesService.remove(+id); 
    return { message: 'Venta eliminada (simulado, implementar en servicio)' };
  }
}