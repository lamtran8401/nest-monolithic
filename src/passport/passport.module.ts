import { AuthModule } from '@apis/auth/auth.module';
import { UsersModule } from '@apis/users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule as NestPassPortModule } from '@nestjs/passport';
import { RedisModule } from '@redis/redis.module';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    RedisModule,
    NestPassPortModule.register({
      session: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [LocalStrategy, JwtStrategy],
})
export class PassportModule {}
