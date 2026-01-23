import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  // Crear (Guardamos auditoría)
  async create(dto: CreateClassDto, userAuditoria: string) {
    const newClass = this.classRepo.create({
      ...dto,
      updatedBy: userAuditoria
    });
    return this.classRepo.save(newClass);
  }

  // Ver todas (Solo activas por defecto)
  findAll() {
    return this.classRepo.find({ 
      order: { hora: 'ASC' } 
      // TypeORM por defecto filtra los soft-deleted, así que esto solo trae los activos.
      // Si quisieras ver archivados, usarías: withDeleted: true
    });
  }

  async findOne(id: number) {
    const clase = await this.classRepo.findOneBy({ id });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

  // Actualizar (Guardamos auditoría)
  async update(id: number, dto: UpdateClassDto, userAuditoria: string) {
    const clase = await this.findOne(id);
    
    this.classRepo.merge(clase, dto);
    clase.updatedBy = userAuditoria; // Registramos quién editó
    
    return this.classRepo.save(clase);
  }

  // 👇 ELIMINACIÓN LÓGICA (Soft Delete)
  async remove(id: number, userAuditoria: string) {
    const clase = await this.findOne(id);
    
    // 1. Marcamos quién la borró
    clase.deletedBy = userAuditoria;
    await this.classRepo.save(clase);

    // 2. La desactivamos (llenamos deletedAt)
    await this.classRepo.softDelete(id);
    
    return { message: 'Clase archivada correctamente' };
  }
}