import { BaseEntity } from '@common/base';
import * as argon from 'argon2';
import { IsEmail, IsString } from 'class-validator';
import { Role } from 'src/common/enums';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @IsString()
  @Column({ default: 'User name' })
  name: string;
  @IsEmail()
  @Column({ unique: true })
  email!: string;
  @IsString()
  @Column()
  password: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
  @Column({ default: true })
  isActive: boolean;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @BeforeInsert()
  async beforeInsert() {
    this.password = await argon.hash(this.password);
  }
}
