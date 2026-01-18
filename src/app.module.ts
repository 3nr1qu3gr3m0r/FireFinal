import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';

// Módulos de la aplicación
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { XvAnosModule } from './xv-anos/xv-anos.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { ClassesModule } from './clases/classes.module';

// Entidades 
import { Usuario } from './users/entities/user.entity';

@Module({
  imports: [
    // 1. Configuración Global 
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
      autoLoadEntities: true, // Gracias a esto, la entidad 'Producto' se carga sola al importar el módulo
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
        from:'"Soporte Fire Inside" <fireinside.sistema@gmail.com>' 
      },
    }),

    // 4. Módulos de Funcionalidad
    AuthModule,
    UsersModule,
    SeedModule,
    XvAnosModule,
    ProductsModule,
    SalesModule,
    FilesModule,
    ClassesModule,
  ],
  controllers:[],
  providers:[],
})
export class AppModule {}