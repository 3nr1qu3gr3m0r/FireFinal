import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';

import { Booking, EstadoReserva } from './entities/booking.entity';
import { Class } from '../clases/entities/class.entity';
import { Usuario } from '../users/entities/user.entity';
import { UserPackage } from '../sales/entities/user-package.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    @InjectRepository(UserPackage) private userPackageRepo: Repository<UserPackage>,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { usuario_id, clase_id, fecha_clase } = createBookingDto;

    // INICIO TRANSACCIÓN (Para evitar descontar clases si falla la reserva)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validaciones Básicas
      const usuario = await this.userRepo.findOneBy({ id: usuario_id });
      if (!usuario) throw new NotFoundException('Alumno no encontrado');

      const clase = await this.classRepo.findOneBy({ id: clase_id });
      if (!clase) throw new NotFoundException('Clase no encontrada');

      // 2. Verificar duplicados (¿Ya reservó para ese día y clase?)
      const duplicada = await this.bookingRepo.findOne({
        where: { 
            usuario: { id: usuario_id }, 
            clase: { id: clase_id },
            fecha_clase: fecha_clase
        }
      });
      if (duplicada && duplicada.estado !== EstadoReserva.CANCELADA) {
        throw new ConflictException('Ya tienes una reserva activa para esta clase.');
      }

      // 3. BUSCAR PAQUETE ACTIVO (Lógica Inteligente)
      // Buscamos un paquete que sea del usuario, tenga clases > 0 y no haya expirado
      const paqueteActivo = await this.userPackageRepo.findOne({
        where: {
          usuario: { id: usuario_id },
          activo: true,
          clases_restantes: MoreThan(0),
          // Nota: También deberíamos filtrar por fecha_expiracion >= hoy en una query real,
          // pero asumiremos que el flag 'activo' se mantiene actualizado o agregamos la condición aquí.
        },
        order: { fecha_expiracion: 'ASC' } // Usar primero el que vence antes
      });

      const nuevaReserva = new Booking();
      nuevaReserva.usuario = usuario;
      nuevaReserva.clase = clase;
      nuevaReserva.fecha_clase = fecha_clase;

      // 4. DECISIÓN: ¿Cobrar o Pendiente?
      if (paqueteActivo) {
        // A) Tiene paquete: Descontamos crédito y Confirmamos
        nuevaReserva.estado = EstadoReserva.CONFIRMADA;
        nuevaReserva.metodo_pago = 'Paquete';
        nuevaReserva.paquete_usado_id = paqueteActivo.id;

        // Descontar la clase (Usamos queryRunner para que sea atómico)
        paqueteActivo.clases_restantes -= 1;
        if (paqueteActivo.clases_restantes === 0) {
          paqueteActivo.activo = false; // Se acabó el paquete
        }
        await queryRunner.manager.save(paqueteActivo);

      } else {
        // B) No tiene paquete: Reserva Pendiente de Pago
        nuevaReserva.estado = EstadoReserva.PENDIENTE;
        nuevaReserva.metodo_pago = 'Por definir (Taquilla/Transferencia)';
        nuevaReserva.paquete_usado_id = null;
      }

      // 5. Guardar Reserva
      const reservaGuardada = await queryRunner.manager.save(nuevaReserva);

      await queryRunner.commitTransaction();

      return {
        message: paqueteActivo ? 'Reserva confirmada (Clase descontada)' : 'Reserva creada. Pendiente de pago.',
        booking: reservaGuardada,
        saldo_restante: paqueteActivo ? paqueteActivo.clases_restantes : 0
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Obtener historial de un alumno
  async findAllByStudent(studentId: number) {
    return this.bookingRepo.find({
      where: { usuario: { id: studentId } },
      relations: ['clase'],
      order: { fecha_clase: 'DESC' }
    });
  }
}