import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement) private repo: Repository<Announcement>,
  ) {}

  async create(texto: string, imagenUrl: string | undefined, user: any) {
    if (user.rol !== 'admin') {
        throw new ForbiddenException('Solo el administrador puede publicar anuncios.');
    }

    const anuncio = this.repo.create({
        contenido: texto || null,
        imagen_url: imagenUrl || null, // Guardamos la URL directa
        autor: user
    });

    return this.repo.save(anuncio);
  }
  
  async findAll() {
    return this.repo.find({
        order: { fecha_creacion: 'ASC' }, // Orden cronológico para chat
        relations: ['autor']
    });
  }

  async remove(id: number, user: any) {
    if (user.rol !== 'admin') throw new ForbiddenException('No tienes permisos.');
    
    const anuncio = await this.repo.findOneBy({ id });
    if (!anuncio) throw new NotFoundException('Anuncio no encontrado');

    return this.repo.softRemove(anuncio);
  }
}