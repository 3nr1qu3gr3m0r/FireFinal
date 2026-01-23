import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Token + Rol
  @Roles('admin') // 👮‍♂️ Solo Admin
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Token + Rol
  @Roles('admin') // 👮‍♂️ Solo Admin
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: CreateProductDto, @Req() req) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Token + Rol
  @Roles('admin') // 👮‍♂️ Solo Admin
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.productsService.remove(id, req.user);
  }
}