import { Token } from '@common/types';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { PayloadJwt } from './jwt.interface';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  sign(payload: PayloadJwt, options?: JwtSignOptions): Token {
    return this.jwtService.sign(payload, options);
  }

  verify(token: Token, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }
}
