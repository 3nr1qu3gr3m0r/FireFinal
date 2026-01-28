import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';

@Entity('anuncios')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  // 👇 CORRECCIÓN: Agregar '| null' para que TypeScript acepte nulos
  contenido: string | null;

  @Column({ type: 'text', nullable: true })
  // 👇 CORRECCIÓN: Agregar '| null'
  imagen_url: string | null;

  @CreateDateColumn()
  fecha_creacion: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autor_id' })
  autor: Usuario;
}