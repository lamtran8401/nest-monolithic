import { TypeormExceptionFilter } from '@common/filters';
import { ResponseTransformInterceptor } from '@common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(helmet());

  app.use(compression());

  app.use(cookieParser());

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new TypeormExceptionFilter());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
