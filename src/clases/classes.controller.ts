import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Req, ForbiddenException, ParseIntPipe 
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // Helper para validar permisos y obtener firma
  private validateAccess(req: any) {
    const role = req.user.rol;
    if (role !== 'admin' && role !== 'recepcionista') {
      throw new ForbiddenException('No tienes permisos para gestionar clases.');
    }
    // Retornamos "ID - Nombre"
    return `${req.user.id} - ${req.user.nombre || 'Usuario'}`;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateClassDto, @Req() req) {
    const user = this.validateAccess(req);
    return this.classesService.create(dto, user);
  }

  @Get()
  // @UseGuards(JwtAuthGuard) // Puedes descomentar si quieres que sea privado
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Patch(':id') // Usamos Patch para actualizaciones parciales
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateClassDto, 
    @Req() req
  ) {
    const user = this.validateAccess(req);
    return this.classesService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = this.validateAccess(req);
    return this.classesService.remove(id, user);
  }
}