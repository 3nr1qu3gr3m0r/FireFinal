import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/entities/user.entity';
import { LoginDto, RegistroDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // --- REGISTRO (Público solo para Alumnos) ---
  async register(dto: RegistroDto) {
    // Si no especifican rol, es alumno
    const rolUsuario = dto.rol || 'alumno';

    // Validar que no exista ese correo PARA ESE ROL
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { correo: dto.correo, rol: rolUsuario }
    });

    if (usuarioExiste) {
      throw new BadRequestException('Este correo ya está registrado para este tipo de usuario.');
    }

    const hash = await bcrypt.hash(dto.contrasena, 10);

    // Creamos el usuario con los datos básicos
    const nuevoUsuario = this.usuarioRepository.create({
      nombre_completo: dto.nombre_completo,
      correo: dto.correo,
      contrasena: hash,
      rol: rolUsuario,
      // Los demás datos (médicos, etc) quedan en null hasta que editen perfil
    });

    await this.usuarioRepository.save(nuevoUsuario);

    return {
      mensaje: 'Registro exitoso',
      token: this.generarJwt(nuevoUsuario),
      usuario: { id: nuevoUsuario.id, rol: nuevoUsuario.rol }
    };
  }

  // --- LOGIN (Acepta Correo o ID) ---
  async login({ identificador, contrasena }: LoginDto) {
    let usuario: Usuario | null = null;

    // Detectar si es ID (número) o Correo (texto)
    const esNumero = /^\d+$/.test(identificador);

    if (esNumero) {
      // Búsqueda por ID (Ideal para Recepcionistas/Alumnos con mismo nombre)
      usuario = await this.usuarioRepository.findOneBy({ id: Number(identificador) });
    } else {
      // Búsqueda por Correo
      // NOTA: Si un correo tiene cuenta de Alumno y Recepcionista, 
      // por defecto el login por correo traerá al primero que encuentre.
      // Recomendación: Recepcionistas deben loguear por ID.
      usuario = await this.usuarioRepository.findOne({ where: { correo: identificador } });
    }

    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) throw new UnauthorizedException('Contraseña incorrecta');

    return {
      token: this.generarJwt(usuario),
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre_completo, 
        rol: usuario.rol,
        foto: usuario.foto_perfil 
      }
    };
  }

private generarJwt(usuario: Usuario) {
    // 👇 CAMBIO: Agregamos 'nombre' al payload
    const payload = { 
      sub: usuario.id, 
      correo: usuario.correo, 
      rol: usuario.rol, 
      nombre: usuario.nombre_completo // 👈 ¡ESTO FALTABA!
    };
    return this.jwtService.sign(payload);
  }

// --- 1. SOLICITAR CAMBIO DE CONTRASEÑA (Lógica Inteligente) ---
  async solicitarRestauracion(correo: string) {
    const usuarios = await this.usuarioRepository.find({ where: { correo } });

    if (!usuarios || usuarios.length === 0) {
      return { message: 'Si el correo existe, se enviaron las instrucciones.' };
    }

    // 1. Generamos los enlaces para todos los usuarios encontrados
    const enlaces = usuarios.map((usuario) => {
      const token = this.jwtService.sign(
        { sub: usuario.id, rol: usuario.rol, action: 'reset' },
        { secret: 'SECRETO_RESETS', expiresIn: '15m' } 
      );
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const url = `${frontendUrl}/reset-password?token=${token}`;
      return { 
        nombre: usuario.nombre_completo,
        rol: usuario.rol, 
        url: `${frontendUrl}/reset-password?token=${token}` 
      };
    });

    let htmlContent = '';

    // 2. DECIDIMOS EL CONTENIDO DEL CORREO SEGÚN LA CANTIDAD DE CUENTAS
    if (enlaces.length === 1) {
        // --- CASO A: SOLO UNA CUENTA (Mensaje directo) ---
        const datos = enlaces[0];
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Hola, ${datos.nombre}</h1>
                <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Fire Inside</strong>.</p>
                <p>Para continuar, haz clic en el siguiente enlace:</p>
                <p>
                    <a href="${datos.url}" style="background-color: #C4006B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Restablecer mi Contraseña
                    </a>
                </p>
                <p style="font-size: 12px; color: #777; margin-top: 20px;">Si no fuiste tú, ignora este mensaje. El enlace expira en 15 minutos.</p>
            </div>
        `;
    } else {
        // --- CASO B: VARIAS CUENTAS (Menú de selección) ---
        const listaHtml = enlaces
          .map((link) => `<li style="margin-bottom: 10px;"><a href="${link.url}" style="color: #C4006B; font-weight: bold;">Recuperar cuenta de ${link.rol.toUpperCase()}</a></li>`)
          .join('');

        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Hola</h1>
                <p>Hemos detectado que este correo está asociado a <strong>${enlaces.length} cuentas</strong> diferentes.</p>
                <p>Por favor, selecciona cuál deseas recuperar:</p>
                <ul>${listaHtml}</ul>
                <p style="font-size: 12px; color: #777; margin-top: 20px;">Si no fuiste tú, ignora este mensaje.</p>
            </div>
        `;
    }

    // 3. Enviamos el correo
    await this.mailerService.sendMail({
      to: correo,
      subject: 'Restablecer Contraseña - Fire Inside', // Asunto más limpio
      html: htmlContent,
    });

    return { message: 'Correo enviado correctamente' };
  }
  
  // --- 2. CAMBIAR LA CONTRASEÑA (Usando el token) ---
  async restaurarContrasena(token: string, nuevaContrasena: string) {
    try {
      // Verificar y decodificar el token
      const payload = this.jwtService.verify(token, { secret: 'SECRETO_RESETS' });
      
      if (payload.action !== 'reset') throw new UnauthorizedException('Token inválido');

      const idUsuario = payload.sub;
      
      // Encriptar nueva contraseña
      const hash = await bcrypt.hash(nuevaContrasena, 10);

      // Actualizar solo a ese usuario específico
      await this.usuarioRepository.update(idUsuario, { contrasena: hash });

      return { message: 'Contraseña actualizada con éxito' };

    } catch (error) {
      throw new UnauthorizedException('El enlace ha expirado o es inválido');
    }
  }  
}