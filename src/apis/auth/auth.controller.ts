import { User } from '@apis/users/entities/user.entity';
import { Cookies, GetUser } from '@common/decorators';
import { JwtAuthGuard } from '@common/guards';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto, ChangePasswordDto } from './dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
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

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Body() input: ChangePasswordDto, @GetUser() user: User) {
    return this.authService.changePassword(input, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@GetUser() user: User, @Res({ passthrough: true }) res) {
    return this.authService.logout(user, res);
  }

  @Get('refresh-token')
  refreshToken(@Cookies('refresh_token') refreshToken: string, @Res({ passthrough: true }) res) {
    return this.authService.refreshToken(refreshToken, res);
  }
}
