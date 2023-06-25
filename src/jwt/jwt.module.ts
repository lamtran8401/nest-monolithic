import { UsersModule } from '@apis/users/users.module';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './jwt.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '30m' },
      }),
    }),
    UsersModule,
  ],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule {}
