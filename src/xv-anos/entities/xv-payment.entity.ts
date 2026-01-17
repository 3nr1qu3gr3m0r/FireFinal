import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { XvContract } from './xv-contract.entity';

@Entity('xv_payments')
export class XvPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  conceptName: string; // Guardamos el nombre como referencia histórica (ej: "General" o "Vestuario")

  @ManyToOne(() => XvContract, (contract) => contract.payments, { onDelete: 'CASCADE' })
  contract: XvContract;
}