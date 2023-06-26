import { UsersService } from '@apis/users/users.service';
import { TokenExpires } from '@common/constant';
import { JWTService } from '@jwt/jwt.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisService } from '@redis/redis.service';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './dtos';
import { Message } from './entities/mesage.entity';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private redisService: RedisService,
    private jwtService: JWTService,
    private usersService: UsersService,
    private roomService: RoomService,
    private messageService: MessageService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server: Server) {
    console.log('ChatGateway initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ..._args: any[]) {
    const user = await this.getUserData(client);
    this.redisService.set({
      key: `CHAT:${user.id}`,
      value: client.id,
      expired: TokenExpires.redisRefreshToken,
    });
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUserData(client);
    this.redisService.del(`CHAT:${user.id}`);
  }

  async getUserData(client: Socket) {
    const bearerToken = client.handshake.headers.authorization;
    const token = bearerToken?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }
    const { sub } = await this.jwtService.verify(token);
    return this.usersService.findOne(sub);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: ChatMessage): Promise<void> {
    const { roomId, text, attachments } = payload;
    const user = await this.getUserData(client);
    if (!text || !roomId) throw new BadRequestException('Missing payload message');
    const room = await this.roomService.getOneByIdOrFail(roomId);
    const { members } = room;
    const socketIds: string[] = [];
    for (let i = 0; i < members.length; i++) {
      const memberId = members[i];
      const socketId = await this.redisService.get(`CHAT:${memberId}`);
      if (socketId) socketIds.push(socketId);
    }

    const message = new Message();
    message.text = text;
    message.attachments = attachments;
    message.roomId = roomId;
    const newMessage = await message.save();

    socketIds.forEach(socketId => {
      client.to(socketId).emit('receiveMessage', {
        ...newMessage,
        sender: { ...user, password: undefined },
      });
    });
  }
}
