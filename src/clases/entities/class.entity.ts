import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NivelClase {
  INICIACION = 'iniciacion',
  PRINCIPIANTE = 'principiante',
  MULTINIVEL = 'multinivel',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  ESPECIAL = 'especial'
}

@Entity('clases')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  maestro: string;

  // 💰 NUEVO CAMPO: PRECIO
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'date' })
  fecha_inicio: string; 

  @Column({ type: 'time' })
  hora: string; 

  @Column({ type: 'enum', enum: NivelClase, default: NivelClase.MULTINIVEL })
  nivel: NivelClase;

  @Column({ type: 'int', default: 7 })
  dias_repeticion: number;

  @Column({ type: 'varchar', nullable: true })
  imagen: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}