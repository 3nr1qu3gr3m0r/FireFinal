import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Req, ForbiddenException 
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // 👇 ACTUALIZADO: Retorna el string "ID - Nombre"
  private validateAccess(req: any) {
    const role = req.user.rol;
    if (role !== 'admin' && role !== 'recepcionista') {
      throw new ForbiddenException('No tienes permisos para gestionar planes.');
    }
    
    // Construimos la firma de auditoría: "15 - Juan Pérez"
    const auditSignature = `${req.user.id} - ${req.user.nombre || 'Usuario'}`;
    return auditSignature;
  }

  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @Req() req) {
    const userSignature = this.validateAccess(req);
    return this.plansService.create(createPlanDto, userSignature);
  }

  @Get()
  findAll(@Req() req) {
    this.validateAccess(req);
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Req() req) {
    const userSignature = this.validateAccess(req);
    return this.plansService.update(+id, updateData, userSignature);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userSignature = this.validateAccess(req);
    return this.plansService.remove(+id, userSignature);
  }

}