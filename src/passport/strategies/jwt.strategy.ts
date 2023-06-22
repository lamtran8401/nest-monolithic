import { UsersService } from '@apis/users/users.service';
import { PayloadJwt } from '@jwt/jwt.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RedisService } from '@redis/redis.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadJwt) {
    const { sub } = payload;
    await this.redisService.getAccessToken(sub.toString());
    return this.usersService.findOne(payload.sub);
  }
}
