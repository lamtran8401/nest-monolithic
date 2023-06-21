import { AuthModule } from '@apis/auth/auth.module';
import { UsersModule } from '@apis/users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule as NestPassPortModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    NestPassPortModule.register({
      session: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [LocalStrategy, JwtStrategy],
})
export class PassportModule {}
