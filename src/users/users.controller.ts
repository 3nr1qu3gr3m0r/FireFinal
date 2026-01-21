// backend/src/users/users.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common'; // Asegúrate de importar Patch y Body
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch('paquetes/:id/cancelar')
  cancelarPaquete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.cancelPackage(id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 👇 AGREGA ESTE ENDPOINT NUEVO 👇
  @Patch(':id') // Esto crea la ruta PATCH /users/:id
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: any // Recibe el JSON del frontend (formData)
  ) {
    return this.usersService.update(id, updateData);
  }
}