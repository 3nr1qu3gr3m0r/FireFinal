import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Req, ForbiddenException 
} from '@nestjs/common';
import { XvAnosService } from './xv-anos.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { AddConceptDto } from './dto/add-concept.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('xv-anos')
@UseGuards(JwtAuthGuard) // 🔒 Seguridad Activada
export class XvAnosController {
  constructor(private readonly xvAnosService: XvAnosService) {}

  private validateAdmin(req: any) {
    if (req.user.rol !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede gestionar XV Años.');
    }
  }

  @Post()
  create(@Body() dto: CreateContractDto, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.create(dto);
  }

  @Get()
  findAll(@Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.findAll();
  }

  // 👇 Importante: Este endpoint trae las relaciones por 'eager: true' en la entidad
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContractDto, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.remove(id);
  }
  
  // 👇 RUTAS EN INGLÉS (Sincronizadas con Frontend)
  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: AddPaymentDto, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.addPayment(id, dto);
  }

  @Post(':id/concepts')
  addConcept(@Param('id') id: string, @Body() dto: AddConceptDto, @Req() req) {
    this.validateAdmin(req);
    return this.xvAnosService.addConcept(id, dto);
  }
}