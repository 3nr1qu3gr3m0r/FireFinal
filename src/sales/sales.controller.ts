import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
// Asumiendo que tienes un JwtAuthGuard ya configurado (si no, avísame)
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // 👈 IMPORTANTE: Descomentar cuando tengas el Guard listo
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    // Si usas Guard, el usuario viene en req.user
    // Por ahora, simularemos que viene el usuario si no tienes el Guard activo
    // PERO LO IDEAL es usar el Guard.
    // Asumiremos que el frontend manda el ID del usuario en el token o header por ahora si no tienes Guard
    // Para hacerlo profesional, usaremos el req.user que inyecta Passport
    
    // ⚠️ ATENCIÓN: Necesitamos obtener el usuario real. 
    // Si ya tienes JwtAuthGuard funcionando, usa req.user.
    // Si no, tendremos que recibir el vendedor_id en el body (menos seguro).
    
    // Voy a asumir que pasas el ID del vendedor en el DTO temporalmente para que funcione YA,
    // pero luego lo cambiamos a req.user.
    
    // AJUSTE TEMPORAL: Voy a pedir el usuario ID en el servicio directo buscando uno hardcodeado 
    // O mejor, obtendremos el usuario del request (asumiendo que implementaremos AuthGuard)
    return this.salesService.create(createSaleDto, req.user); 
  }

  @Get()
  findAll() {
      return this.salesService.findAll();
  }
}