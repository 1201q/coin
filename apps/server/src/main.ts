import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(passport.initialize());

  app.enableCors({
    origin: ["https://coingosu.live", "http://localhost:5500"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}

// 8000

bootstrap();
