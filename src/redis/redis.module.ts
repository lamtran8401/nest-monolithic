import { MetadataKey } from '@common/constant';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: MetadataKey.REDIS,
      useFactory(config: ConfigService) {
        return new Redis({
          port: config.get('REDIS_PORT'),
          host: config.get('REDIS_HOST'),
          db: config.get('REDIS_DB'),
          password: config.get('REDIS_PASSWORD'),
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
