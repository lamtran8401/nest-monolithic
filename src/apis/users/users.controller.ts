import { BaseController } from '@common/base/base.controller';
import { GetUser, Roles } from '@common/decorators';
import { Role } from '@common/enums';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { FileUploadPipe } from '@common/pipes/file-upload.pipe';
import { multerConfig } from '@multer/multer.config';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController extends BaseController<User> {
  relations = [];
  constructor(private usersService: UsersService) {
    super(usersService);
  }

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

  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.OK)
  @Post('upload')
  uploadAvatar(
    @UploadedFile(FileUploadPipe)
    file: Express.Multer.File,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    return this.usersService.uploadAvatar(file, user, req);
  }
}
