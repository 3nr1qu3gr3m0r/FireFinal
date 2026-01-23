import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { SaleItem } from '../../sales/entities/sale-item.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'enum', enum: ['academia', 'sens'], default: 'academia' })
  tienda: string;

  // --- CAMPOS DE AUDITORÍA ---

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string; // ¿Quién lo creó?

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string; // ¿Quién lo editó?

  @DeleteDateColumn()
  deletedAt: Date; // Fecha de borrado (Soft Delete)

  @Column({ type: 'varchar', nullable: true })
  deletedBy: string; // ¿Quién lo borró?

  // ---------------------------

  @OneToMany(() => SaleItem, (saleItem) => saleItem.producto)
  ventas_donde_aparece: SaleItem[];

  @Column({ type: 'boolean', default: false })
  es_paquete: boolean; 

  @Column({ type: 'int', nullable: true })
  numero_clases: number | null; 

  @Column({ type: 'int', nullable: true })
  dias_vigencia: number | null; 
}