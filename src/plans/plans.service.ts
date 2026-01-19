import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { Class } from '../clases/entities/class.entity'; // Importar entidad Clases
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  async create(dto: CreatePlanDto) {
    // 1. Buscar las clases reales en la BD usando los IDs
    const clasesEntidades = await this.classRepo.findBy({
        id: In(dto.clasesIds)
    });

    if (clasesEntidades.length === 0) {
        throw new NotFoundException('No se encontraron las clases seleccionadas');
    }

    // 2. Crear el plan y asignar la relación
    const nuevoPlan = this.planRepo.create({
        ...dto,
        clases_incluidas: clasesEntidades // TypeORM maneja la tabla intermedia
    });

    return this.planRepo.save(nuevoPlan);
  }

  findAll() {
    // Traer planes CON sus clases relacionadas
    return this.planRepo.find({ relations: ['clases_incluidas'] });
  }

  async update(id: number, dto: CreatePlanDto) {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    // Actualizar datos básicos
    plan.nombre = dto.nombre;
    plan.precio = dto.precio;
    plan.vigencia_dias = dto.vigencia_dias;
    plan.cantidad_clases = dto.cantidad_clases;

    // Actualizar relaciones
    const clasesEntidades = await this.classRepo.findBy({ id: In(dto.clasesIds) });
    plan.clases_incluidas = clasesEntidades;

    return this.planRepo.save(plan);
  }

  async remove(id: number) {
    await this.planRepo.delete(id);
    return { message: 'Plan eliminado' };
  }
}