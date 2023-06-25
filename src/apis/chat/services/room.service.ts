import { UsersService } from '@apis/users/users.service';
import { BaseService } from '@common/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomService extends BaseService<Room> {
  name = 'room';

  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    private usersService: UsersService,
  ) {
    super(roomRepository);
  }

  async create(input: CreateRoomDto): Promise<Room> {
    const { members } = input;
    for (let i = 0; i < members.length; i++) {
      const userId = members[i];
      await this.usersService.findOne(userId);
    }
    return this.roomRepository.create(input).save();
  }

  async checkMember(roomId: number, userId: number): Promise<boolean> {
    const room = await this.roomRepository.findOneOrFail({
      where: {
        id: roomId,
        members: ArrayContains([userId]),
      },
    });
    return !!room;
  }
}
