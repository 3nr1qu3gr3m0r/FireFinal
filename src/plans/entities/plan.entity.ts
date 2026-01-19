import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Class } from '../../clases/entities/class.entity';

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // 💰 Precio del plan
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  // 📅 Cuántos días dura (ej: 30 para mensual)
  @Column({ type: 'int' })
  vigencia_dias: number;

  // 🎟️ Número de clases (-1 podría ser ilimitado, pero usaremos int normal por ahora)
  @Column({ type: 'int' })
  cantidad_clases: number;

  // 🔗 RELACIÓN MUCHOS A MUCHOS
  // "Un plan incluye muchas clases"
  @ManyToMany(() => Class)
  @JoinTable({ name: 'planes_clases' }) // Tabla intermedia automática
  clases_incluidas: Class[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}