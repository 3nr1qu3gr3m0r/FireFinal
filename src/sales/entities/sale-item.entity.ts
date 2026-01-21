import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Producto } from '../../products/entities/product.entity';
import { Class } from '../../clases/entities/class.entity'; // 👈 Importar
import { Plan } from '../../plans/entities/plan.entity';     // 👈 Importar (Asumo que tienes PlanesModule)

@Entity('ventas_detalle')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Sale;

  // OPCIÓN 1: Es un producto físico (Agua, Ropa)
  @ManyToOne(() => Producto, { nullable: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto | null;

  // OPCIÓN 2: Es una Clase Suelta (Drop-in)
  @ManyToOne(() => Class, { nullable: true })
  @JoinColumn({ name: 'clase_id' })
  clase: Class | null;

  // OPCIÓN 3: Es un Paquete/Plan (Mensualidad)
  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number; // Guardamos el precio al momento de la venta
}