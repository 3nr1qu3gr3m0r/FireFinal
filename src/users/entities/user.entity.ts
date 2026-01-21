// 👇 AQUÍ ESTABA EL ERROR: Agregamos todos los decoradores que faltaban
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

// Imports de tus otras entidades (asegúrate que las rutas sean correctas)
import { Level } from '../../levels/entities/level.entity';
import { Badge } from '../../badges/entities/badge.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { UserPackage } from '../../sales/entities/user-package.entity';

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
  fecha_nacimiento: Date | null;

  @Column({ type: 'text', nullable: true }) 
  whatsapp: string | null;

  @Column({ type: 'text', nullable: true })
  instagram: string | null;

  @Column({ type: 'text', nullable: true })
  foto_perfil: string | null;

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

  // --- RELACIONES ---

  // 1. Nivel
  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: 'nivel_id' })
  nivel: Level;

  // 2. Insignias
  @ManyToMany(() => Badge)
  @JoinTable({
    name: 'usuario_insignias',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'insignia_id', referencedColumnName: 'id' }
  })
  insignias: Badge[];

  // 3. Paquetes/Suscripciones
  @OneToMany(() => UserPackage, (userPackage) => userPackage.usuario)
  paquetes: UserPackage[];

  // 4. Reservas
  @OneToMany(() => Booking, (booking) => booking.usuario)
  reservas: Booking[];

  // 5. Historial de Compras
  @OneToMany(() => Sale, (sale) => sale.comprador)
  compras: Sale[];
}