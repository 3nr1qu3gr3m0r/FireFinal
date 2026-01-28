import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================================================
  // 1. RUTAS ESPECÍFICAS (Deben ir PRIMERO)
  // =========================================================

  @Post() // Crear usuario
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  // 👇 MOVER ESTO AL PRINCIPIO (Antes de :id)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() updateData: any) {
    const { id, rol, saldo, activo, ...dataToUpdate } = updateData;
    return this.usersService.update(req.user.id, dataToUpdate);
  }

  @Get() // Listar todos
  findAll() {
    return this.usersService.findAll();
  }

  // =========================================================
  // 2. RUTAS DINÁMICAS (Deben ir AL FINAL)
  // =========================================================

  // 👇 Este es el método que estaba "robando" la petición
  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}