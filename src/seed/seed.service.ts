import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Esta función se ejecuta automáticamente al iniciar la app
  async onApplicationBootstrap() {
    await this.createAdmin();
  }

  async createAdmin() {
    // 1. Verificar si ya existe algún administrador
    const adminExistente = await this.usuarioRepository.findOneBy({ rol: 'admin' });

    if (adminExistente) {
      console.log('✅ El Administrador ya existe en la base de datos.');
      return;
    }

    console.log('🚀 Creando Administrador Maestro...');

    // 2. Encriptar la contraseña del Admin
    const password = await bcrypt.hash('Admin123!', 10); // ⚠️ CAMBIA ESTA CONTRASEÑA

    // 3. Crear el objeto con TODOS los datos requeridos
    const admin = this.usuarioRepository.create({
      nombre_completo: 'Administrador Principal',
      correo: 'admin@fireinside.com', // ⚠️ TU CORREO DE ADMIN
      contrasena: password,
      rol: 'admin',
      
      // --- DATOS EXTRAS DEL PERFIL ---
      fecha_nacimiento: new Date('1990-01-01'),
      whatsapp: '5500000000',
      instagram: '@fireinside_admin',
      foto_perfil: null, // Puedes poner una URL de imagen aquí si tienes

      // --- CONTACTO DE EMERGENCIA ---
      emergencia_nombre: 'Contacto Admin',
      emergencia_parentesco: 'Socio',
      emergencia_telefono: '5599999999',

      // --- SALUD ---
      informacion_medica: 'Ninguna alergia conocida.',
      
      // Recepcionista/Admin no requieren dirección obligatoria en tu lógica, 
      // pero si quieres agregarla:
      direccion: 'Oficina Central Fire Inside',
      
      activo: true,
    });

    // 4. Guardar en Base de Datos
    await this.usuarioRepository.save(admin);
    console.log('✅ ¡Administrador creado exitosamente!');
  }
}