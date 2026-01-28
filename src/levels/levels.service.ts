import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { Usuario } from '../users/entities/user.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AssignLevelDto } from './dto/assign-level.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level) private levelRepo: Repository<Level>,
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
  ) {}

  // 🔹 Helper de Auditoría
  private getAuditSignature(user: any): string {
    const nombre = user.nombre || 'Desconocido';
    const id = user.id || '?';
    return `${nombre} (ID: ${id})`;
  }

  // --- CREAR ---
  async create(dto: CreateLevelDto, user: any) {
    const level = this.levelRepo.create({
      ...dto,
      isActive: true,
      // ✍️ Guardamos firma
      createdBy: this.getAuditSignature(user) 
    });
    return await this.levelRepo.save(level);
  }

  // --- LEER ---
  findAll() {
    return this.levelRepo.find({ 
      where: { isActive: true }, 
      order: { id: 'ASC' } 
    });
  }

  // --- ACTUALIZAR ---
  async update(id: number, dto: UpdateLevelDto, user: any) {
    const level = await this.levelRepo.preload({ 
      id, 
      ...dto,
      // ✍️ Guardamos firma
      updatedBy: this.getAuditSignature(user) 
    });
    
    if (!level) throw new NotFoundException(`Nivel #${id} no encontrado`);
    return this.levelRepo.save(level);
  }

  // --- ELIMINAR ---
  async remove(id: number, user: any) {
    const level = await this.levelRepo.findOneBy({ id });
    if (!level) throw new NotFoundException(`Nivel #${id} no encontrada`);

    level.isActive = false;
    // ✍️ Guardamos firma
    level.deletedBy = this.getAuditSignature(user);
    
    await this.levelRepo.save(level);
    await this.levelRepo.softDelete(id);

    return { message: 'Nivel eliminado correctamente' };
  }

  // --- ASIGNAR NIVEL (CORREGIDO) ---
  async assignLevel(dto: AssignLevelDto) {
    const usuario = await this.userRepo.findOne({
      where: { id: dto.usuario_id },
      relations: ['nivel'] // 👈 CORREGIDO: Es 'nivel', no 'nivel_actual'
    });
    
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const nuevoNivel = await this.levelRepo.findOneBy({ id: dto.nivel_id });
    if (!nuevoNivel) throw new NotFoundException('Nivel no encontrado');

    usuario.nivel = nuevoNivel; // 👈 CORREGIDO: Es 'nivel'
    await this.userRepo.save(usuario);

    return { message: 'Nivel asignado correctamente' };
  }
}