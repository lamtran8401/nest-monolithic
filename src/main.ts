import { TypeormExceptionFilter } from '@common/filters';
import { ResponseTransformInterceptor } from '@common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new TypeormExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
