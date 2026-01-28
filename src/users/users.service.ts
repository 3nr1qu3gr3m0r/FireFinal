import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Usuario } from './entities/user.entity';
import { UserPackage } from '../sales/entities/user-package.entity';
import { Sale } from '../sales/entities/sale.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario) 
    private readonly userRepository: Repository<Usuario>,
    
    @InjectRepository(UserPackage) 
    private readonly packageRepository: Repository<UserPackage>,
    
    @InjectRepository(Sale) 
    private readonly saleRepository: Repository<Sale>,
  ) {}

  // --- 1. CREAR USUARIO ---
  async create(data: any) {
    // Verificamos si ya existe el correo para el rol (opcional, pero recomendado aquí también)
    const existing = await this.userRepository.findOne({
        where: { correo: data.correo, rol: data.rol }
    });
    if (existing) {
        throw new ConflictException('El correo ya está registrado para este rol.');
    }

    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  // --- 2. OBTENER TODOS (CON ESTADÍSTICAS PARA STAFF) ---
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['nivel', 'insignias', 'paquetes', 'paquetes.plan'],
      order: { nombre_completo: 'ASC' }
    });

    // Calcular estadísticas para staff (recepcionistas/admins)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Enriquecemos la respuesta con estadísticas
    const usersWithStats = await Promise.all(users.map(async (user) => {
        if (user.rol === 'recepcionista' || user.rol === 'admin') {
            const sales = await this.saleRepository.find({
                where: {
                    vendedor: { id: user.id },
                    fecha_venta: Between(startOfMonth, endOfMonth)
                }
            });
            
            return {
                ...user,
                stats: {
                    monthlySalesCount: sales.length,
                    monthlyTotal: sales.reduce((sum, sale) => sum + Number(sale.total), 0)
                }
            };
        }
        return user;
    }));

    return usersWithStats;
  }

  // --- 3. OBTENER UNO (CON RELACIONES PROFUNDAS) ---
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'nivel', 
        'insignias', 
        'paquetes', 
        'paquetes.plan',
        'paquetes.plan.clases', 
        'reservas', 
        'reservas.clase',
        'compras',
        'compras.items',
        'compras.items.clase'
      ] 
    });

    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    
    // Eliminamos la contraseña del objeto retornado por seguridad
    const { contrasena, ...result } = user;
    return result;
  }

  // --- 4. BUSCAR POR EMAIL ---
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ correo: email });
  }

  // --- 5. ACTUALIZAR USUARIO (CON VALIDACIÓN DE CORREO) ---
  async update(id: number, updateData: any) {
    // 1. Obtener usuario actual para ver su rol y datos previos
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // 2. Validación: Si cambia el correo, verificar que no exista otro con ese correo Y mismo rol
    if (updateData.correo && updateData.correo !== user.correo) {
        const existingUser = await this.userRepository.findOne({
            where: {
                correo: updateData.correo,
                rol: user.rol, // Validamos contra el rol actual del usuario
                id: Not(id)    // Excluir al usuario actual de la búsqueda
            }
        });

        if (existingUser) {
            throw new ConflictException('Este correo ya está registrado por otro usuario con el mismo rol.');
        }
    }

    // 3. Merge de datos
    this.userRepository.merge(user, updateData);
    
    // 4. Guardar
    const savedUser = await this.userRepository.save(user);
    
    // 5. Retornar limpio
    return this.findOne(savedUser.id);
  }

  // --- 6. ELIMINAR USUARIO ---
  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return this.userRepository.remove(user);
  }

  // --- 7. CANCELAR PAQUETE ---
  async cancelPackage(packageId: number) {
    const paquete = await this.packageRepository.findOneBy({ id: packageId });
    
    if (!paquete) {
      throw new NotFoundException(`Paquete con ID ${packageId} no encontrado`);
    }

    paquete.activo = false; 
    
    return this.packageRepository.save(paquete);
  }
}