import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Response } from 'express';
import { setTokenToCookie } from 'src/common/helpers/set-token';
import { PayloadJwt } from 'src/common/types/payload-jwt.type';
import { Token } from 'src/common/types/token.type';
import { User } from '../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Not found user with this email.');
    const matchedPassword = await argon.verify(user.password, password);

    if (!matchedPassword)
      throw new UnauthorizedException('Invalid email or password.');

    return user;
  }

  async login(user: User, res: Response) {
    const payload: PayloadJwt = {
      sub: user.id,
    };
    return this.createCredentials(payload, res);
  }

  async register(userDto: AuthDto, res: Response) {
    const user = await this.usersService.create(userDto);

    const payload: PayloadJwt = {
      sub: user.id,
    };

    return this.createCredentials(payload, res);
  }

  genTokens(payload: PayloadJwt) {
    const access_token: Token = this.jwtService.sign(payload);
    const refresh_token: Token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '30d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  createCredentials(payload: PayloadJwt, res: Response) {
    const { access_token, refresh_token } = this.genTokens(payload);

    setTokenToCookie(res, refresh_token);

    return { access_token };
  }
}
