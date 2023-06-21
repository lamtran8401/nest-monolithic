import { GetUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
