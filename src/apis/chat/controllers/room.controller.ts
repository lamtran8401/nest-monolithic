import { BaseController } from '@common/base/base.controller';
import { PaginationDto } from '@common/base/base.dto';
import { GetUser } from '@common/decorators';
import { JwtAuthGuard } from '@common/guards';
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArrayContains } from 'typeorm';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { UpdateRoomDto } from '../dtos/update-room.dto';
import { Room } from '../entities/room.entity';
import { RoomService } from '../services/room.service';

@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController extends BaseController<Room> {
  relations = [];

  constructor(private roomService: RoomService) {
    super(roomService);
  }

  @Get('all')
  getAllByUserId(@GetUser('id') userId: number, @Query() query: PaginationDto) {
    return this.roomService.getAllAdvanced(query, {
      members: ArrayContains([userId]),
    });
  }

  @Post()
  override create(@Body() body: CreateRoomDto) {
    return super.create(body);
  }

  @Put(':id')
  updateRoom(@Param('id') roomId: number, @Body() body: UpdateRoomDto) {
    return super.update(roomId, body);
  }
}
