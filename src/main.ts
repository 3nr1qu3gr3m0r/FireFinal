import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo Global: Todas las rutas serán http://.../api/...
  app.setGlobalPrefix('api');

  // 2. Validaciones: Activar las comprobaciones de datos (DTOs)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 3. CORS: Permisos para que el Frontend (puerto 3000) pueda entrar
  app.enableCors({
    origin: process.env.FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Puerto: Usar 3001 para no chocar con el Frontend
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en: http://localhost:${port}/api`);
}
bootstrap();