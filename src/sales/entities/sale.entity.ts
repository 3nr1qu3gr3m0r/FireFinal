import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { SaleItem } from './sale-item.entity';

// Tipos de venta para tus filtros de estadísticas
export enum TipoVenta {
  TIENDA = 'tienda',        // Ropa, agua (Mostrador)
  PAQUETE = 'paquete',      // 10 Clases, Mensualidad
  CLASE_SUELTA = 'clase',   // Drop-in
  INSCRIPCION = 'inscripcion' // Anualidad
}

// Métodos de pago permitidos
export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TRANSFERENCIA = 'Transferencia',
  TARJETA = 'Tarjeta' // Pasarela de pagos (Mercado Pago / Stripe)
}

@Entity('ventas')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO })
  metodo_pago: MetodoPago;

  @Column({ type: 'enum', enum: TipoVenta, default: TipoVenta.TIENDA })
  tipo_venta: TipoVenta;

  // 🔹 NUEVO: Para guardar ID de MercadoPago o Folio de Transferencia
  @Column({ type: 'varchar', nullable: true })
  referencia_externa: string | null;

  @CreateDateColumn()
  fecha_venta: Date;

  // --- ACTORES ---

  // 🔹 CAMBIO CLAVE: nullable: true
  // Si es NULL, significa que fue una COMPRA ONLINE (Autoservicio)
  // Si tiene ID, fue una venta ASISTIDA (Admin/Recepción)
  @ManyToOne(() => Usuario, { nullable: true }) 
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario | null;

  // El cliente (Obligatorio para Paquetes/Online, Opcional para Tienda Física)
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'comprador_usuario_id' })
  comprador: Usuario | null;

  // Nombre para clientes no registrados (Invitados)
  @Column({ type: 'varchar', nullable: true })
  nombre_cliente_externo: string | null;

  // --- DETALLES ---
  @OneToMany(() => SaleItem, (item) => item.venta, { cascade: true })
  items: SaleItem[];
}