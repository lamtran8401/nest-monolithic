import { UsersService } from '@apis/users/users.service';
import { JWTService } from '@jwt/jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private jwtService: JWTService, private usersService: UsersService) {}

  afterInit(server: any) {
    return 'afterInit';
  }
  handleConnection(client: Socket, ...args: any[]) {
    return 'handleConnection';
  }
  handleDisconnect(client: Socket) {
    return 'handleDisconnect';
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
}
