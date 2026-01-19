import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('niveles')
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Evitamos nombres duplicados
  nombre: string;

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}