import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4000',
      'http://localhost:3000',
      'https://studio.apollographql.com',
      '*',
    ],
  });
  await app.listen(3000);
}
bootstrap();
