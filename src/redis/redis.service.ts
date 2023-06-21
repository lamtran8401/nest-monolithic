import { MetadataKey } from '@common/constant';
import { RedisType } from '@common/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(MetadataKey.REDIS) private redis: Redis) {}

  set(redisData: RedisType): Promise<'OK'> {
    const { key, value, expired } = redisData;
    return this.redis.set(key, value, 'EX', expired);
  }

  setNx(redisData: RedisType): Promise<number> {
    return this.redis.setnx(redisData.key, redisData.value);
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
