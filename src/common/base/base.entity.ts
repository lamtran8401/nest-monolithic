import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeormBaseEntity,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
