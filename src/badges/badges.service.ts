import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
  ) {}

  async create(dto: CreateBadgeDto) {
    const badge = this.badgeRepo.create(dto);
    return await this.badgeRepo.save(badge);
  }

  findAll() {
    return this.badgeRepo.find({ order: { id: 'DESC' } });
  }

  async update(id: number, dto: UpdateBadgeDto) {
    const badge = await this.badgeRepo.preload({ id, ...dto });
    if (!badge) throw new NotFoundException(`Insignia #${id} no encontrada`);
    return this.badgeRepo.save(badge);
  }

  async remove(id: number) {
    const result = await this.badgeRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Insignia #${id} no encontrada`);
    return { message: 'Insignia eliminada' };
  }
}