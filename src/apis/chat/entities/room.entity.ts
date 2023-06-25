import { BaseEntity } from '@common/base';
import { Column, Entity } from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @Column()
  name!: string;
  @Column({ type: 'int', array: true, default: [] })
  members!: number[];
}
