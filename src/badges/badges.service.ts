import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Usuario } from '../users/entities/user.entity';
import { AssignBadgesDto } from './dto/assign-badges.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
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

  async assignBadges(dto: AssignBadgesDto) {
    const usuario = await this.userRepo.findOne({
        where: { id: dto.usuario_id },
        relations: ['insignias'] 
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const nuevasInsignias = await this.badgeRepo.findBy({
        id: In(dto.insignia_ids)
    });

    usuario.insignias = nuevasInsignias;
    await this.userRepo.save(usuario);
    
    return { message: 'Insignias actualizadas correctamente' };
  }
}