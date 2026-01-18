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

  // --- PUNTO DE ENTRADA AL INICIAR LA APP ---
  async onApplicationBootstrap() {
    console.log('🌱 Iniciando proceso de Semillas (Seeding)...');
    await this.createAdmin();
    await this.createRecepcionista();
    await this.createAlumno();
    console.log('✅ Proceso de Semillas finalizado.');
  }

  // 1. ADMIN
  async createAdmin() {
    const email = 'admin@fireinside.com';
    const exists = await this.usuarioRepository.findOneBy({ correo: email });

    if (exists) {
      console.log(`🔹 Admin (${email}) ya existe. Saltando...`);
      return;
    }

    const password = await bcrypt.hash('Admin123', 10);

    const admin = this.usuarioRepository.create({
      nombre_completo: 'Administrador Principal',
      correo: email,
      contrasena: password,
      rol: 'admin',
      fecha_nacimiento: new Date('1985-01-01'),
      whatsapp: '5511111111',
      activo: true,
      foto_perfil: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // Icono genérico
    });

    await this.usuarioRepository.save(admin);
    console.log('🚀 Admin creado: admin@fireinside.com / Admin123');
  }

  // 2. RECEPCIONISTA
  async createRecepcionista() {
    const email = 'recepcion@fireinside.com';
    const exists = await this.usuarioRepository.findOneBy({ correo: email });

    if (exists) {
      console.log(`🔹 Recepcionista (${email}) ya existe. Saltando...`);
      return;
    }

    const password = await bcrypt.hash('Recepcion123', 10);

    const recepcionista = this.usuarioRepository.create({
      nombre_completo: 'Laura Recepción',
      correo: email,
      contrasena: password,
      rol: 'recepcionista',
      fecha_nacimiento: new Date('1995-05-15'),
      whatsapp: '5522222222',
      direccion: 'Mostrador Principal Fire Inside',
      activo: true,
      foto_perfil: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
    });

    await this.usuarioRepository.save(recepcionista);
    console.log('🚀 Recepcionista creada: recepcion@fireinside.com / Recepcion123');
  }

  // 3. ALUMNO
  async createAlumno() {
    const email = 'alumno@fireinside.com';
    const exists = await this.usuarioRepository.findOneBy({ correo: email });

    if (exists) {
      console.log(`🔹 Alumno (${email}) ya existe. Saltando...`);
      return;
    }

    const password = await bcrypt.hash('Alumno123', 10);

    const alumno = this.usuarioRepository.create({
      nombre_completo: 'Juanito Alumno',
      correo: email,
      contrasena: password,
      rol: 'alumno',
      fecha_nacimiento: new Date('2005-10-20'),
      whatsapp: '5533333333',
      informacion_medica: 'Alergia al polvo',
      emergencia_nombre: 'Mamá de Juanito',
      emergencia_telefono: '5544444444',
      activo: true,
      foto_perfil: 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png'
    });

    await this.usuarioRepository.save(alumno);
    console.log('🚀 Alumno creado: alumno@fireinside.com / Alumno123');
  }
}