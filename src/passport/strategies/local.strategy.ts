import { AuthService } from '@apis/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // constructor(private moduleRef: ModuleRef) {
  //   super({ usernameField: 'email', passReqToCallback: true });
  // }

  // async validate(request: Request, email: string, password: string) {
  //   const contextId = ContextIdFactory.getByRequest(request);
  //   const authService = await this.moduleRef.resolve(AuthService, contextId);
  //   const user = await authService.validateUser(email, password);
  //   return user;
  // }
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.authService.validateUser(email, password);
  }
}
