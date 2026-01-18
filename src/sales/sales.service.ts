import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale, TipoVenta, MetodoPago } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Producto } from '../products/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Usuario } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Producto) private productRepo: Repository<Producto>,
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
  ) {}

  // Nota: 'vendedor' ahora puede venir undefined (si es venta online futura)
  async create(createSaleDto: CreateSaleDto, vendedor?: Usuario) {
    const { 
        items, 
        metodo_pago, 
        comprador_id, 
        nombre_externo, 
        referencia_externa,
        tipo_venta 
    } = createSaleDto;
    
    // 1. Validar Comprador (Si aplica)
    let comprador: Usuario | null = null;
    if (comprador_id) {
        comprador = await this.userRepo.findOneBy({ id: comprador_id });
        if (!comprador) throw new NotFoundException('Comprador no encontrado');
    }

    // 2. Calcular Total
    let totalVenta = 0;
    const saleItems: SaleItem[] = [];

    for (const itemDto of items) {
      const producto = await this.productRepo.findOneBy({ id: itemDto.producto_id });
      if (!producto) throw new NotFoundException(`Producto ${itemDto.producto_id} no encontrado`);

      const subtotal = Number(producto.precio) * itemDto.cantidad;
      totalVenta += subtotal;

      const newItem = new SaleItem();
      newItem.producto = producto;
      newItem.cantidad = itemDto.cantidad;
      newItem.precio_unitario = Number(producto.precio);
      saleItems.push(newItem);
    }

    // 3. Crear Venta
    const nuevaVenta = this.saleRepo.create({
      total: totalVenta,
      metodo_pago,
      referencia_externa, // Guardamos el folio/ID pago
      tipo_venta: tipo_venta || TipoVenta.TIENDA, // Default a Tienda
      vendedor: vendedor || null, // Si no hay vendedor, es NULL (Online)
      comprador,
      nombre_cliente_externo: nombre_externo || (comprador ? comprador.nombre_completo : 'Mostrador'),
      items: saleItems,
    });

    return this.saleRepo.save(nuevaVenta);
  }

  async findAll() {
      return this.saleRepo.find({ 
          relations: ['items', 'items.producto', 'vendedor', 'comprador'],
          order: { fecha_venta: 'DESC' }
      });
  }
}