import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { XvConcept } from './xv-concept.entity';
import { XvPayment } from './xv-payment.entity';

@Entity('xv_contracts')
export class XvContract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentName: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  contractTotal: number; // La deuda total acordada (Costo del Paquete General)

  // Relación: Un contrato tiene muchos conceptos
  @OneToMany(() => XvConcept, (concept) => concept.contract, { cascade: true, eager: true })
  concepts: XvConcept[];

  // Relación: Un contrato tiene muchos pagos
  @OneToMany(() => XvPayment, (payment) => payment.contract, { cascade: true, eager: true })
  payments: XvPayment[];

  @CreateDateColumn()
  createdAt: Date;
}