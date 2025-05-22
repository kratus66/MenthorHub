import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import { ClassSerializerInterceptor } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3001);
  console.log("Application is running on: http://localhost:3001");
}
bootstrap();
