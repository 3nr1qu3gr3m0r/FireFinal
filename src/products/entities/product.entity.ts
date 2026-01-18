import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// Importamos la entidad de detalle de venta para hacer la relación inversa (opcional pero recomendada)
// Nota: Usamos 'import type' o require circular si SaleItem está en otro módulo, 
// pero en NestJS suele funcionar bien si la ruta es correcta.
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 👇 RELACIÓN INVERSA IMPORTANTE
  // Esto protege tus datos: No podrás borrar un producto "a la fuerza" si ya existen ventas históricas de él,
  // a menos que configures onDelete: 'CASCADE' (que no se recomienda para historial financiero).
  @OneToMany(() => SaleItem, (saleItem) => saleItem.producto)
  ventas_donde_aparece: SaleItem[];
}