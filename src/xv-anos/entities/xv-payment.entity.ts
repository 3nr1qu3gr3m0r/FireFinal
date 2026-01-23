import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
  conceptName: string;

  // 👇 CORRECCIÓN: Agregamos @JoinColumn
  @ManyToOne(() => XvContract, (contract) => contract.payments, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'contractId' }) 
  contract: XvContract;
}