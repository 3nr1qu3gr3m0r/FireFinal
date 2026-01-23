import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
  paid: number;

  // 👇 CORRECCIÓN: Agregamos @JoinColumn
  @ManyToOne(() => XvContract, (contract) => contract.concepts, { 
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  @JoinColumn({ name: 'contractId' }) // Vincula explícitamente la columna FK
  contract: XvContract;
}