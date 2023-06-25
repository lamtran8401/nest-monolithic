import { User } from '@apis/users/entities/user.entity';
import { UsersService } from '@apis/users/users.service';
import { Token } from '@common/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtVerifyPayload, PayloadJwt } from './jwt.interface';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  sign(payload: PayloadJwt, isRefreshToken = false): Token {
    return isRefreshToken ? this.signRefreshToken(payload) : this.jwtService.sign(payload);
  }

  verify(token: Token, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }

  private signRefreshToken(payload: PayloadJwt): Token {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '30d',
    });
  }

  genTokens(payload: PayloadJwt): {
    access_token: Token;
    refresh_token: Token;
  } {
    const access_token = this.sign(payload);
    const refresh_token = this.sign(payload, true);

    return { access_token, refresh_token };
  }

  async getUserFromToken(token: Token): Promise<User> {
    const payload: JwtVerifyPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_REFRESH,
    });

    const user: User = await this.usersService.findOne(payload.sub);

    if (!user) throw new BadRequestException('Not found user with this credentials.');

    return user;
  }
}
