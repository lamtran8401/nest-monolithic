import { ApiModule } from '@apis/api.module';
import { CryptoModule } from '@crypto/crypto.module';
import { DatabaseModule } from '@database/database.module';
import { JWTModule } from '@jwt/jwt.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@passport/passport.module';
import { RedisModule } from '@redis/redis.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public',
    }),
    DatabaseModule,
    JWTModule,
    RedisModule,
    PassportModule,
    CryptoModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
