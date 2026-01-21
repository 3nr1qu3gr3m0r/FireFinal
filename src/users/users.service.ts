import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';
// 👇 Asegúrate que esta ruta apunte a tu entidad real
import { UserPackage } from '../sales/entities/user-package.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,

    // 👇 ESTO FALTABA O ESTABA MAL DECLARADO
    @InjectRepository(UserPackage)
    private readonly packageRepository: Repository<UserPackage>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      // Cargamos relaciones: paquetes (y su plan), reservas, compras
      relations: ['nivel', 'insignias', 'paquetes', 'paquetes.plan', 'reservas', 'compras'] 
    });

    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    
    // Eliminamos contraseña
    const { contrasena, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ correo: email });
  }

  async update(id: number, updateData: any) {
    const result = await this.userRepository.update(id, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado para actualizar`);
    }
    return this.findOne(id);
  }

  // 👇 TU NUEVO MÉTODO DE CANCELACIÓN
  async cancelPackage(packageId: number) {
    // Ahora 'this.packageRepository' sí existe gracias al constructor
    const paquete = await this.packageRepository.findOneBy({ id: packageId });
    
    if (!paquete) {
      throw new NotFoundException(`Paquete con ID ${packageId} no encontrado`);
    }

    // Desactivamos lógicamente
    paquete.activo = false; 
    
    return this.packageRepository.save(paquete);
  }
}