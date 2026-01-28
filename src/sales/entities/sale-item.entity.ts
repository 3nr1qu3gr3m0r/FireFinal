import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Producto } from '../../products/entities/product.entity';
import { Class } from '../../clases/entities/class.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('ventas_detalle')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Sale;

  @ManyToOne(() => Producto, { nullable: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto | null;

  @ManyToOne(() => Class, { nullable: true })
  @JoinColumn({ name: 'clase_id' })
  clase: Class | null;

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  // 👇 AGREGAR ESTO: Guardará 'producto', 'clase', 'plan' o 'deuda'
  @Column({ type: 'varchar', length: 50, default: 'producto' })
  tipo: string; 

    
}