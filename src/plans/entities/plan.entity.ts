import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable 
} from 'typeorm';
import { Class } from '../../clases/entities/class.entity'; // Asegúrate de que la ruta sea correcta

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; // 👈 Cambiado de 'name' a 'nombre'

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('int')
  cantidad_clases: number;

  @Column('int')
  vigencia_dias: number;

  @Column({ default: true })
  isActive: boolean;

  // 👇 RELACIÓN: Un plan incluye muchas clases
  @ManyToMany(() => Class)
  @JoinTable({
    name: 'plan_classes', // Nombre de la tabla intermedia
    joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
  })
  clases: Class[];

  // --- AUDITORÍA ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn() 
  deletedAt: Date; 

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ type: 'varchar', nullable: true })
  deletedBy: string | null;
}