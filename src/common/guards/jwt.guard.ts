import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<User>(err: any, user: any, info: any): User {
    if (info instanceof Error && info.name === 'TokenExpiredError')
      throw new BadRequestException(info.message);

    if (err || !user) throw err || new UnauthorizedException('Invalid token');

    return user;
  }
}
