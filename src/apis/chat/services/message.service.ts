import { UsersService } from '@apis/users/users.service';
import { BaseService } from '@common/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/mesage.entity';
import { CreateMessageDto } from './../dtos/create-message.dto';
import { RoomService } from './room.service';

@Injectable()
export class MessageService extends BaseService<Message> {
  name = 'message';

  constructor(
    @InjectRepository(Message) messageRepository,
    private usersService: UsersService,
    private roomService: RoomService,
  ) {
    super(messageRepository);
  }

  async createMessage(input: CreateMessageDto) {
    const { roomId, userId } = input;
    await this.usersService.findOne(userId);
    await this.roomService.getOneByIdOrFail(roomId);
    return this.repo.create(input).save();
  }
}
