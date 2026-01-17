import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { XvContract } from './xv-contract.entity';

@Entity('xv_concepts')
export class XvConcept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  realCost: number; // Gasto

  @Column('decimal', { precision: 10, scale: 2 })
  clientCost: number; // Venta

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paid: number; // Cuánto se ha abonado a este concepto específico

  @ManyToOne(() => XvContract, (contract) => contract.concepts, { onDelete: 'CASCADE' })
  contract: XvContract;
}