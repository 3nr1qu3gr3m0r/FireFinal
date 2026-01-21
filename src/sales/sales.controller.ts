// File: backend/src/sales/sales.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(JwtAuthGuard) 
  create(@Body() createSaleDto: CreateSaleDto, @Req() req) {
    // Si no tienes AuthGuard activo, req.user será undefined.
    // El servicio manejará eso poniendo vendedor = null (Venta Online/Anónima)
    // O puedes enviar un ID de admin temporalmente en el DTO si lo necesitas.
    
    return this.salesService.create(createSaleDto, req.user);
  }

  @Get()
  findAll() {
      return this.salesService.findAll();
  }
}