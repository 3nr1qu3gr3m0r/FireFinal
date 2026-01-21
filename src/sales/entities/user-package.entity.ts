import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity'; // 👈 Asegúrate que la ruta sea correcta
import { Producto } from '../../products/entities/product.entity';
import { Sale } from './sale.entity';

@Entity('usuario_paquetes')
export class UserPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // 👇 ESTO ES LO QUE TE FALTA PARA CORREGIR LOS ERRORES DE LÍNEA 95 Y 126
  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @ManyToOne(() => Producto, { nullable: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto | null;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'venta_origen_id' })
  venta_origen: Sale;

  @Column({ type: 'int', default: 0 })
  clases_totales: number;

  @Column({ type: 'int', default: 0 })
  clases_restantes: number;

  @Column({ type: 'date', nullable: true })
  fecha_expiracion: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_acordado: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monto_pagado: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_activacion: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
saldo_pendiente: number;

}