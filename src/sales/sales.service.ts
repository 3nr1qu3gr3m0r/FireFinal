import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Sale, TipoVenta } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { UserPackage } from './entities/user-package.entity';
import { Producto } from '../products/entities/product.entity';
import { Class } from '../clases/entities/class.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Usuario } from '../users/entities/user.entity';
import { CreateSaleDto, CreateSaleItemDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    @InjectRepository(UserPackage) private readonly packageRepository: Repository<UserPackage>,
    private dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto, vendedor?: Usuario) {
    const { items, metodo_pago, comprador_id, nombre_externo, referencia_externa, tipo_venta } = createSaleDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar Comprador (Necesario para Planes y Deudas)
      let comprador: Usuario | null = null;
      if (comprador_id) {
        comprador = await this.userRepo.findOneBy({ id: comprador_id });
        if (!comprador) throw new NotFoundException('Comprador no encontrado');
      }

      // 2. Crear Objeto Venta Base
      const nuevaVenta = new Sale();
      nuevaVenta.metodo_pago = metodo_pago as any;
      nuevaVenta.referencia_externa = referencia_externa || null;
      nuevaVenta.tipo_venta = (tipo_venta as TipoVenta) || TipoVenta.TIENDA;
      nuevaVenta.vendedor = vendedor || null;
      nuevaVenta.comprador = comprador;
      nuevaVenta.nombre_cliente_externo = nombre_externo || (comprador ? comprador.nombre_completo : 'Cliente');
      nuevaVenta.items = [];
      nuevaVenta.total = 0;

      // 3. PROCESAR ITEMS
      for (const itemDto of items) {
        const newItem = new SaleItem();
        newItem.cantidad = itemDto.cantidad;
        
        // 🔹 LÓGICA DE PRECIO: Usamos el precio final del frontend si existe (para descuentos), si no, 0 temporalmente
        let precioCobrado = itemDto.precio_final !== undefined ? Number(itemDto.precio_final) : 0;
        
        // --- CASO A: PRODUCTO ---
        if (itemDto.tipo === 'producto') {
            const prod = await queryRunner.manager.findOne(Producto, { where: { id: itemDto.id_referencia } });
            if (!prod) throw new NotFoundException(`Producto #${itemDto.id_referencia} no encontrado`);
            
            newItem.producto = prod;
            // Si no mandaron precio (venta normal sin descuento), usamos el de DB
            if (itemDto.precio_final === undefined) precioCobrado = Number(prod.precio);
        }
        
        // --- CASO B: CLASE ---
        else if (itemDto.tipo === 'clase') {
            const cls = await queryRunner.manager.findOne(Class, { where: { id: itemDto.id_referencia } });
            if (!cls) throw new NotFoundException(`Clase #${itemDto.id_referencia} no encontrada`);
            
            newItem.clase = cls;

            // ⚡ PAGO CON PAQUETE (Costo $0)
            if (itemDto.usar_paquete_id) {
                if (!comprador) throw new BadRequestException("Se requiere alumno para usar paquete");
                
                const paquete = await queryRunner.manager.findOne(UserPackage, { where: { id: itemDto.usar_paquete_id } });
                if (!paquete) throw new NotFoundException("Paquete no encontrado o expirado");
                if (paquete.clases_restantes < 1) throw new BadRequestException("El paquete ya no tiene clases disponibles");

                // Restamos la clase
                paquete.clases_restantes -= 1;
                await queryRunner.manager.save(paquete);

                precioCobrado = 0; // No se cobra dinero, se cobra en especie
            } else {
                // Pago normal (drop-in)
                if (itemDto.precio_final === undefined) precioCobrado = Number(cls.precio);
            }
        }

        // --- CASO C: PLAN (Generación de UserPackage) ---
        else if (itemDto.tipo === 'plan') {
             if (!comprador) throw new BadRequestException('Para comprar planes se requiere un alumno registrado.');
             
             const plan = await queryRunner.manager.findOne(Plan, { where: { id: itemDto.id_referencia } });
             if (!plan) throw new NotFoundException(`Plan #${itemDto.id_referencia} no encontrado`);

             newItem.plan = plan;
             
             // Si no mandaron precio (venta normal), usamos el de DB
             if (itemDto.precio_final === undefined) precioCobrado = Number(plan.precio);

             // 📌 CREAR USER PACKAGE
             for (let i = 0; i < itemDto.cantidad; i++) {
                 const userPackage = new UserPackage();
                 userPackage.usuario = comprador;
                 userPackage.plan = plan;
                 
                 // 👇 CORRECCIÓN: Usamos tus nombres de variables
                 userPackage.clases_totales = plan.cantidad_clases; 
                 userPackage.clases_restantes = plan.cantidad_clases;
                 
                 const totalA_Pagar = itemDto.precio_acordado !== undefined 
                                      ? Number(itemDto.precio_acordado) 
                                      : Number(plan.precio);

                 userPackage.precio_acordado = totalA_Pagar;
                 
                 // Lógica de Deuda / Plazo
                 if (itemDto.es_plazo) {
                     userPackage.monto_pagado = precioCobrado; // Lo que pagó hoy (puede ser 0 o enganche)
                     userPackage.saldo_pendiente = Number(plan.precio) - precioCobrado;
                 } else {
                     // Pago de contado
                     userPackage.monto_pagado = Number(plan.precio); 
                     userPackage.saldo_pendiente = 0;
                 }

                 const hoy = new Date();
                 const exp = new Date(hoy);
                 // 👇 CORRECCIÓN: Usamos tu nombre de variable
                 exp.setDate(hoy.getDate() + plan.vigencia_dias); 
                 userPackage.fecha_expiracion = exp;

                 // Guardamos en array temporal
                 if (!nuevaVenta['paquetesAPicesar']) nuevaVenta['paquetesAPicesar'] = [];
                 nuevaVenta['paquetesAPicesar'].push(userPackage);
             }
        }

        // --- CASO D: ABONO DE DEUDA ---
        else if (itemDto.tipo === 'deuda') {
            if (!comprador) throw new BadRequestException('Se requiere alumno para abonar');

            const deudaPackage = await queryRunner.manager.findOne(UserPackage, { where: { id: itemDto.id_referencia } });
            if (!deudaPackage) throw new NotFoundException("Paquete/Deuda no encontrado");

            // Validar monto
            if (precioCobrado > Number(deudaPackage.saldo_pendiente)) {
                throw new BadRequestException(`El abono ($${precioCobrado}) supera la deuda ($${deudaPackage.saldo_pendiente})`);
            }

            // Actualizar deuda
            deudaPackage.monto_pagado = Number(deudaPackage.monto_pagado) + precioCobrado;
            deudaPackage.saldo_pendiente = Number(deudaPackage.saldo_pendiente) - precioCobrado;
            
            await queryRunner.manager.save(deudaPackage);

            // En el detalle de venta guardamos referencia al plan original
            newItem.plan = deudaPackage.plan; 
        }

        newItem.precio_unitario = precioCobrado;
        nuevaVenta.total += precioCobrado * itemDto.cantidad;
        nuevaVenta.items.push(newItem);
      }

      // 4. Guardar Venta Maestra
      const ventaGuardada = await queryRunner.manager.save(nuevaVenta);

      // 5. Post-Procesamiento (Vincular Paquetes Nuevos a la Venta)
      if (nuevaVenta['paquetesAPicesar']) {
          for (const pkg of nuevaVenta['paquetesAPicesar']) {
              pkg.venta_origen = ventaGuardada;
              await queryRunner.manager.save(pkg);
          }
          delete ventaGuardada['paquetesAPicesar']
      }

      await queryRunner.commitTransaction();
      return { message: 'Venta registrada exitosamente', sale: ventaGuardada };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.saleRepo.find({
      relations: ['items', 'items.producto', 'items.clase', 'items.plan', 'vendedor', 'comprador'],
      order: { fecha_venta: 'DESC' }
    });
  }

}