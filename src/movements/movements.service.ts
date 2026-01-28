import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement) private movementRepo: Repository<Movement>,
  ) {}

  // Consulta por rango de fechas
  async findAll(start: string, end: string) {
    // Ajustamos las fechas para cubrir todo el día
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    return this.movementRepo.find({
      where: {
        fecha: Between(startDate, endDate),
        // TypeORM filtra deletedAt automáticamente
      },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  // Borrado Lógico (Soft Delete) - Solo Admin
  async remove(id: number, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar movimientos.');
    }

    const movement = await this.movementRepo.findOneBy({ id });
    if (!movement) throw new NotFoundException('Movimiento no encontrado');

    await this.movementRepo.softDelete(id); // Esto llena la columna deletedAt
    return { message: 'Movimiento eliminado correctamente' };
  }
  
  // (Opcional) Método para crear movimiento manual
  async create(data: any, user: any) {
      const move = this.movementRepo.create({
          ...data,
          usuario: user
      });
      return this.movementRepo.save(move);
  }
}