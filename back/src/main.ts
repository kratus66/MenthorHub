import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { SeederService } from "./seeder/seeder.service";  
import { AuthService } from "./auth/auth.service";
import passport, { initialize } from 'passport';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: "*",
    credentials:true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const server = app.getHttpServer();
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  app.setGlobalPrefix("api");

  // Activar el interceptor global
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  (global as any).io = io;

  const config = new DocumentBuilder()
    .setTitle("MentorHub API")
    .setDescription("Documentación de la API de MentorHub")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth' 
    )
    .build();
    app.use(cookieParser());
  app.use(passport.initialize())

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // await app.listen(3001);
  await app.listen(3001, '0.0.0.0');
  console.log("Application is running on: http://localhost:3001");
}
bootstrap();

