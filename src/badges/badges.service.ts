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

  // 🔹 Helper para formatear la firma de auditoría
  private getAuditSignature(user: any): string {
    // Si por alguna razón no viene el nombre, ponemos "Desconocido"
    const nombre = user.nombre || 'Desconocido';
    const id = user.id || '?';
    return `${nombre} (ID: ${id})`;
  }

  // --- CREAR ---
  async create(dto: CreateBadgeDto, user: any) {
    const badge = this.badgeRepo.create({
      ...dto,
      isActive: true,
      // ✍️ Guardamos Nombre + ID
      createdBy: this.getAuditSignature(user) 
    });
    return await this.badgeRepo.save(badge);
  }

  // --- LEER ---
  findAll() {
    return this.badgeRepo.find({ 
      where: { isActive: true }, 
      order: { id: 'DESC' } 
    });
  }

  // --- ACTUALIZAR ---
  async update(id: number, dto: UpdateBadgeDto, user: any) {
    const badge = await this.badgeRepo.preload({ 
      id, 
      ...dto,
      // ✍️ Guardamos Nombre + ID
      updatedBy: this.getAuditSignature(user) 
    });
    
    if (!badge) throw new NotFoundException(`Insignia #${id} no encontrada`);
    return this.badgeRepo.save(badge);
  }

  // --- ELIMINAR (Soft Delete) ---
  async remove(id: number, user: any) {
    const badge = await this.badgeRepo.findOneBy({ id });
    if (!badge) throw new NotFoundException(`Insignia #${id} no encontrada`);

    badge.isActive = false;
    // ✍️ Guardamos Nombre + ID
    badge.deletedBy = this.getAuditSignature(user); 
    
    await this.badgeRepo.save(badge); 
    await this.badgeRepo.softDelete(id); 

    return { message: 'Insignia eliminada correctamente' };
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