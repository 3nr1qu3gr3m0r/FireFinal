import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { SaleItem } from './sale-item.entity';

// Tipos de venta (Referencia)
export enum TipoVenta {
  TIENDA = 'tienda',
  PAQUETE = 'paquete',
  CLASE_SUELTA = 'clase',
  INSCRIPCION = 'inscripcion',
  ABONO = 'abono',
  MIXTA = 'mixta' // 👈 Asegúrate que esté aquí para uso en el código
}

// Métodos de pago (Referencia)
export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TRANSFERENCIA = 'Transferencia',
  TARJETA = 'Tarjeta',
  PLAN = 'Plan/Cortesía'
}

@Entity('ventas')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Cambiado a varchar para evitar problemas de ENUM
  @Column({ type: 'varchar', default: 'Efectivo' }) 
  metodo_pago: string;

  // 👇 CAMBIO IMPORTANTE: Ahora es varchar (texto), acepta 'mixta' sin problemas
  @Column({ type: 'varchar', default: 'tienda' })
  tipo_venta: string;

  @Column({ type: 'varchar', nullable: true })
  referencia_externa: string | null;

  @CreateDateColumn()
  fecha_venta: Date;

  // --- ACTORES ---
  @ManyToOne(() => Usuario, { nullable: true }) 
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'comprador_usuario_id' })
  comprador: Usuario | null;

  @Column({ type: 'varchar', nullable: true })
  nombre_cliente_externo: string | null;

  // --- DETALLES ---
  @OneToMany(() => SaleItem, (item) => item.venta, { cascade: true })
  items: SaleItem[];

  
}