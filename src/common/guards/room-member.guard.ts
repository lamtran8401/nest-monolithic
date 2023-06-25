import { RoomService } from '@apis/chat/services/room.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoomMemberGuard implements CanActivate {
  constructor(private roomService: RoomService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roomId = +request.params.roomId || +request.body.roomId;
    const { id: userId } = request.user;
    return this.roomService
      .checkMember(roomId, userId)
      .then(res => res)
      .catch(() => {
        throw new BadRequestException('Not found this room or you are not a member.');
      });
  }
}
