import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  // Crear producto (Usado por el Modal de Tienda)
  async create(createProductDto: CreateProductDto) {
    const producto = this.productoRepo.create(createProductDto);
    return this.productoRepo.save(producto);
  }

  // Listar todos (Usado por el Grid de Tienda y el Selector de Ventas)
  findAll() {
    return this.productoRepo.find({ 
      order: { nombre: 'ASC' } // Orden alfabético
    });
  }

  // Buscar uno por ID
  async findOne(id: number) {
    const producto = await this.productoRepo.findOneBy({ id });
    if (!producto) throw new NotFoundException(`Producto #${id} no encontrado`);
    return producto;
  }

  // Actualizar
  async update(id: number, updateProductDto: CreateProductDto) {
    const producto = await this.findOne(id); // Verifica si existe
    this.productoRepo.merge(producto, updateProductDto);
    return this.productoRepo.save(producto);
  }

  // Eliminar
  async remove(id: number) {
    const producto = await this.findOne(id);
    await this.productoRepo.remove(producto);
    return { message: 'Producto eliminado correctamente' };
  }
}