import { Token } from '@common/types';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { PayloadJwt } from './jwt.interface';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  sign(payload: PayloadJwt, isRefreshToken = false): Token {
    return isRefreshToken
      ? this.signRefreshToken(payload)
      : this.jwtService.sign(payload);
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
}
