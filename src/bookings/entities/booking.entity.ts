import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Class } from '../../clases/entities/class.entity';

export enum EstadoReserva {
  PENDIENTE = 'Pendiente',   // Ej: Pago transferencia sin validar
  CONFIRMADA = 'Confirmada', // Ej: Pagó con paquete o efectivo validado
  CANCELADA = 'Cancelada',
  ASISTIO = 'Asistio'        // Asistencia tomada
}

@Entity('reservas')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'clase_id' })
  clase: Class;

  @Column({ type: 'date' })
  fecha_clase: string; 

  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
  estado: EstadoReserva;

  // Si se pagó usando créditos de un paquete, guardamos cuál fue
  @Column({ type: 'int', nullable: true })
  paquete_usado_id: number | null; 

  // Método de pago para esta reserva específica (si no fue paquete)
  @Column({ type: 'varchar', nullable: true })
  metodo_pago: string; // 'Paquete', 'Efectivo', 'Transferencia'

  @CreateDateColumn()
  fecha_creacion: Date;
}