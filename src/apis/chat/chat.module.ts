import { UsersModule } from '@apis/users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageController } from './controllers/message.controller';
import { RoomController } from './controllers/room.controller';
import { Message } from './entities/mesage.entity';
import { Room } from './entities/room.entity';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message]), UsersModule],
  controllers: [RoomController, MessageController],
  providers: [ChatGateway, RoomService, MessageService],
})
export class ChatModule {}
