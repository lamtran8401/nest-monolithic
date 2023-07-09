import { BaseController } from '@common/base/base.controller';
import { PaginationDto } from '@common/base/base.dto';
import { JwtAuthGuard, RoomMemberGuard } from '@common/guards';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../entities/mesage.entity';
import { MessageService } from '../services/message.service';

@Controller('message')
@UseGuards(JwtAuthGuard, RoomMemberGuard)
export class MessageController extends BaseController<Message> {
  relations = [];
  constructor(private messageService: MessageService) {
    super(messageService);
  }

  @Get(':roomId')
  async getAllRoomMessage(@Param('roomId') roomId: number, @Query() query: PaginationDto) {
    return this.messageService.getAllAdvanced(query, { roomId });
  }

  @Post(':roomId')
  async sendMessage(@Body() input: CreateMessageDto) {
    return this.messageService.create(input);
  }
}
