import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SaleItem } from '../sales/entities/sale-item.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepo: Repository<SaleItem>,
  ) {}

  // CREAR (Firmado)
  async create(createProductDto: CreateProductDto, usuario: any) {
    const producto = this.productoRepo.create(createProductDto);
    producto.createdBy = usuario ? `${usuario.nombre} (ID: ${usuario.id})` : 'Sistema';
    return this.productoRepo.save(producto);
  }

  findAll() {
    // Solo trae los activos (no borrados)
    return this.productoRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOneBy({ id });
    if (!producto) throw new NotFoundException(`Producto #${id} no encontrado`);
    return producto;
  }

  // EDITAR (Firmado)
  async update(id: number, updateProductDto: CreateProductDto, usuario: any) {
    const producto = await this.findOne(id);
    this.productoRepo.merge(producto, updateProductDto);
    producto.updatedBy = usuario ? `${usuario.nombre} (ID: ${usuario.id})` : 'Sistema';
    return this.productoRepo.save(producto);
  }

  // BORRAR (Firmado y Lógico)
  async remove(id: number, usuario: any) {
    const producto = await this.findOne(id);

    // 1. Firmamos quién lo borró
    producto.deletedBy = usuario ? `${usuario.nombre} (ID: ${usuario.id})` : 'Sistema';
    await this.productoRepo.save(producto);

    // 2. Lo enviamos a la papelera (Soft Remove)
    await this.productoRepo.softRemove(producto);

    return { message: 'Producto eliminado correctamente' };
  }
}