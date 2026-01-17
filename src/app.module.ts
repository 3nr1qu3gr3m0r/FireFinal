import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { ConfigModule } from '@nestjs/config';

// Módulos de la aplicación
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { XvAnosModule } from './xv-anos/xv-anos.module';

// Entidades (Solo la de usuario está explícita, las demás se cargan solas)
import { Usuario } from './users/entities/user.entity';

@Module({
  imports: [
    // 1. Configuración Global (Variables de Entorno)
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Base de Datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Usuario], 
      autoLoadEntities: true, // 👈 ESTO ES CLAVE: Carga las entidades de los módulos importados
      synchronize: true,
    }),
    
    // 3. Configuración del Correo
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.MAIL_USER, 
          pass: process.env.MAIL_PASS, 
        },
      },
      defaults:{
        from:'"Soporte Fire Inside" <fireinside.sistema@gmail.com>' // Ajusté el nombre para que se vea bien
      },
    }),

    // 4. Módulos de Funcionalidad
    AuthModule,
    UsersModule,
    SeedModule,
    XvAnosModule, // 👈 Aquí está bien, solo una vez
  ],
  controllers:[],
  providers:[],
})
export class AppModule {}