import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req.user, res);
  }

  @Post('register')
  register(@Body() userDto: AuthDto, @Res({ passthrough: true }) res) {
    return this.authService.register(userDto, res);
  }
}
