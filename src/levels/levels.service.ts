import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level) private levelRepo: Repository<Level>,
  ) {}

  async create(dto: CreateLevelDto) {
    try {
      const level = this.levelRepo.create(dto);
      return await this.levelRepo.save(level);
    } catch (error) {
      if (error.code === '23505') throw new ConflictException('Ya existe un nivel con ese nombre');
      throw error;
    }
  }

  findAll() {
    return this.levelRepo.find({ order: { id: 'ASC' } });
  }

  async update(id: number, dto: UpdateLevelDto) {
    const level = await this.levelRepo.preload({ id, ...dto });
    if (!level) throw new NotFoundException(`Nivel #${id} no encontrado`);
    return this.levelRepo.save(level);
  }

  async remove(id: number) {
    const result = await this.levelRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Nivel #${id} no encontrado`);
    return { message: 'Nivel eliminado correctamente' };
  }
}