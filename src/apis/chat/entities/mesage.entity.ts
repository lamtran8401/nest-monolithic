import { User } from '@apis/users/entities/user.entity';
import { BaseEntity } from '@common/base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Message extends BaseEntity {
  @Column()
  text!: string;
  @Column({ type: 'simple-array', default: '' })
  attachments?: string[];
  @Column({ name: 'user_id' })
  userId!: number;
  @Column({ name: 'room_id' })
  roomId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room?: Room;
}
