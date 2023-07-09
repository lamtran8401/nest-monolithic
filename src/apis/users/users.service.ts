import { BaseService } from '@common/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  name = 'User';
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super(userRepository);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  create(user: AuthDto): Promise<User> {
    return this.userRepository.create(user).save();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  uploadAvatar(file: Express.Multer.File, user: User, req: Request) {
    const oldAvatar = user.avatar;
    if (oldAvatar) {
      const oldAvatarPath = oldAvatar.split('/').slice(-1)[0];
      const path = `./public/${oldAvatarPath}`;
      fs.unlink(path, err => {
        if (err) console.log(err);
      });
    }

    const PORT = this.configService.get<string>('PORT') || 3000;
    const prefix = `${req.protocol}://${req.hostname}:${PORT}`;
    user.avatar = `${prefix}/${file.path}`;
    return user.save();
  }
}
