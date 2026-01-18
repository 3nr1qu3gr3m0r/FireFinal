import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Producto } from '../../products/entities/product.entity';

@Entity('ventas_detalle')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Sale;

  @ManyToOne(() => Producto, (producto) => producto.ventas_donde_aparece, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;
}