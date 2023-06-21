import { User } from '@apis/users/entities/user.entity';
import { UsersService } from '@apis/users/users.service';
import { setTokenToCookie } from '@common/helpers';
import { Token } from '@common/types';
import { PayloadJwt } from '@jwt/jwt.interface';
import { JWTService } from '@jwt/jwt.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Response } from 'express';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JWTService,
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
      email: user.email,
    };

    const access_token = this.createCredentials(payload, res);
    return {
      access_token,
      user,
    };
  }

  async register(userDto: AuthDto, res: Response) {
    const user = await this.usersService.create(userDto);

    const payload: PayloadJwt = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.createCredentials(payload, res);
    return {
      access_token,
      user,
    };
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

  createCredentials(payload: PayloadJwt, res: Response): Token {
    const { access_token, refresh_token } = this.genTokens(payload);

    setTokenToCookie(res, refresh_token);

    return access_token;
  }
}
