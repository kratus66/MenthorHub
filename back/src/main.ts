import * as fs from "fs";
import * as https from "https";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";

async function bootstrap() {
  const mode = process.env.NODE_ENV || "development"; // Define el modo de ejecución

  let server: any; // Variable para el servidor (HTTP o HTTPS)

  if (mode === "production") {
    const httpsOptions = {
      key: fs.readFileSync("C:/win-acme/certs/mentorhub.info.gf-key.pem"),
      cert: fs.readFileSync("C:/win-acme/certs/mentorhub.info.gf-crt.pem"),
    };

    server = https.createServer(httpsOptions);
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions: mode === "production" ? server : undefined,
  });

  app.enableCors({
    origin: "*",
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const httpServer = app.getHttpServer();
  const io = new Server(httpServer, {
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
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Escuchar en el puerto 3001 con HTTPS en producción, HTTP en desarrollo
  await app.listen(3001, mode === "production" ? server : "0.0.0.0");

  console.log(
    `Application is running on: http${mode === "production" ? "s" : ""}://localhost:3001`
  );
}

bootstrap();
