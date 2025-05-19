import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar Socket.IO global
  app.useWebSocketAdapter(new IoAdapter(app));

  // Crear instancia manual de Socket.IO para inyectar
  const server = app.getHttpServer();
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Inyectar la instancia manualmente
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(); // (Opcional si usas alguno)
  // Para compartir la instancia de io, crea un provider personalizado o usa app.locals si accedes desde middlewares/express
    (app as any).io = io; // 👈 clave para acceder desde servicios (temporal, usa un provider para producción)

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('MentorHub API')
    .setDescription('Documentación de la API de MentorHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();
