import { User } from '@apis/users/entities/user.entity';
import { UsersService } from '@apis/users/users.service';
import { setTokenToCookie } from '@common/helpers';
import { Token } from '@common/types';
import { CryptoService } from '@crypto/crypto.service';
import { PayloadJwt } from '@jwt/jwt.interface';
import { JWTService } from '@jwt/jwt.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import { Response } from 'express';
import { ChangePasswordDto } from './dtos';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JWTService,
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Not found user with this email.');

    const matchedPassword = await user.comparePassword(password);
    if (!matchedPassword) throw new UnauthorizedException('Invalid email or password.');

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

  logout(user: User, res: Response) {
    const sub = user.id;
    this.clearCredentials(sub.toString(), res);
    const result = { message: 'Logout successfully' };
    return result;
  }

  changePassword(input: ChangePasswordDto, user: User) {
    return user.changePassword(input);
  }

  async refreshToken(refresh_id: string, res: Response) {
    const decryptId = this.cryptoService.decryptData(refresh_id);
    const refresh_token = await this.redisService.getRefreshToken(decryptId);
    const user = await this.jwtService.getUserFromToken(refresh_token);

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

  private createCredentials(payload: PayloadJwt, res: Response): Token {
    const { access_token, refresh_token } = this.jwtService.genTokens(payload);

    this.redisService.setRefreshToken(payload.sub.toString(), refresh_token);
    this.redisService.setAccessToken(payload.sub.toString(), access_token);

    const encryptId = this.cryptoService.encryptData(payload.sub.toString());

    setTokenToCookie(res, encryptId);

    return access_token;
  }

  private clearCredentials(sub: string, res: Response) {
    res.clearCookie('refresh_token');
    this.redisService.delAccessToken(sub);
    this.redisService.delRefreshToken(sub);
  }
}
