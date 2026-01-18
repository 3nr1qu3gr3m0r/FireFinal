import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateClassDto) {
    const newClass = this.classRepo.create(dto);
    return this.classRepo.save(newClass);
  }

  findAll() {
    return this.classRepo.find({ order: { hora: 'ASC' } });
  }

  async findOne(id: number) {
    const clase = await this.classRepo.findOneBy({ id });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

  async update(id: number, dto: CreateClassDto) {
    const clase = await this.findOne(id);
    this.classRepo.merge(clase, dto);
    return this.classRepo.save(clase);
  }

  async remove(id: number) {
    const clase = await this.findOne(id);
    await this.classRepo.remove(clase);
    return { message: 'Clase eliminada' };
  }
}