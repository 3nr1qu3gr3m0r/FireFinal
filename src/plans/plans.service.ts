import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // 👈 Importamos 'In' para búsquedas masivas
import { Plan } from './entities/plan.entity';
import { Class } from '../clases/entities/class.entity';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Class) private classRepo: Repository<Class>, // 👈 Inyectamos repo de clases
  ) {}

  // --- CREAR PLAN ---
  async create(dto: CreatePlanDto, userEmail: string) {
    // 1. Buscamos las clases seleccionadas
    const selectedClasses = await this.classRepo.findBy({
        id: In(dto.clasesIds)
    });

    if (selectedClasses.length !== dto.clasesIds.length) {
        throw new BadRequestException('Alguna de las clases seleccionadas no existe.');
    }

    // 2. Creamos el plan con la relación
    const plan = this.planRepo.create({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: dto.precio,
        cantidad_clases: dto.cantidad_clases,
        vigencia_dias: dto.vigencia_dias,
        clases: selectedClasses, // 👈 Asignamos las entidades completas
        updatedBy: userEmail,
        isActive: true
    });

    return this.planRepo.save(plan);
  }

  // --- VER TODOS ---
  findAll() {
    return this.planRepo.find({ 
        withDeleted: true,
        relations: ['clases'], // 👈 Cargamos las clases incluidas
        order: { id: 'DESC' } 
    });
  }

  // --- VER UNO ---
  async findOne(id: number) {
    const plan = await this.planRepo.findOne({ 
        where: { id },
        withDeleted: true,
        relations: ['clases'] 
    });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    return plan;
  }

  // --- ACTUALIZAR ---
  async update(id: number, updateData: any, userEmail: string) {
    const plan = await this.findOne(id);
    
    // Si vienen IDs de clases, actualizamos la relación
    if (updateData.clasesIds && Array.isArray(updateData.clasesIds)) {
        const classes = await this.classRepo.findBy({ id: In(updateData.clasesIds) });
        plan.clases = classes;
    }

    // Actualizamos campos simples
    if (updateData.nombre) plan.nombre = updateData.nombre;
    if (updateData.descripcion) plan.descripcion = updateData.descripcion;
    if (updateData.precio) plan.precio = updateData.precio;
    if (updateData.cantidad_clases) plan.cantidad_clases = updateData.cantidad_clases;
    if (updateData.vigencia_dias) plan.vigencia_dias = updateData.vigencia_dias;

    plan.updatedBy = userEmail;
    
    return this.planRepo.save(plan);
  }

  // --- SOFT DELETE ---
  async remove(id: number, userEmail: string) {
    const plan = await this.findOne(id);
    plan.isActive = false;
    plan.deletedBy = userEmail;
    await this.planRepo.save(plan);
    return this.planRepo.softDelete(id);
  }


}