import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('usuarios')
@Unique(['correo', 'rol']) 
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_completo: string;

  @Column()
  correo: string;

  @Column()
  contrasena: string;

  // --- DATOS PERSONALES Y REDES ---
  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date | null; // 👈 Agregamos "| null"

  @Column({ type: 'text', nullable: true }) 
  whatsapp: string | null;       // 👈 Agregamos "| null"

  @Column({ type: 'text', nullable: true })
  instagram: string | null;      // 👈 Agregamos "| null"

  @Column({ type: 'text', nullable: true })
  foto_perfil: string | null;    // 👈 ¡ESTO ES LO QUE ARREGLA TU ERROR!

  // --- CONTACTO DE EMERGENCIA ---
  @Column({ type: 'text', nullable: true })
  emergencia_nombre: string | null;

  @Column({ type: 'text', nullable: true })
  emergencia_parentesco: string | null;

  @Column({ type: 'text', nullable: true })
  emergencia_telefono: string | null;

  // --- SALUD ---
  @Column({ type: 'text', nullable: true })
  informacion_medica: string | null;

  // --- EXCLUSIVO RECEPCIONISTA ---
  @Column({ type: 'text', nullable: true })
  direccion: string | null; 

  // --- SISTEMA ---
  @Column({ default: 'alumno' })
  rol: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date;
}