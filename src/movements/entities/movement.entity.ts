import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';

export enum MovementType {
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
}

@Entity('movimientos')
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'enum', enum: MovementType })
  tipo: MovementType;

  // Fecha en la que OCURRIÓ el movimiento (puede ser distinta a created_at si se registra después)
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  // Quién registró el movimiento
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Soft Delete: Si esto tiene fecha, el movimiento está "borrado"
  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}