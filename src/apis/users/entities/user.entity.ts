import { ChangePasswordDto } from '@apis/auth/dto';
import { BaseEntity } from '@common/base';
import { BadRequestException } from '@nestjs/common';
import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
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
  @Exclude()
  @IsString()
  @Column()
  password: string;
  @Column({ nullable: true })
  avatar: string;
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

  async comparePassword(password: string) {
    return await argon.verify(this.password, password);
  }

  async changePassword(passwordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwordDto;
    const matchedPassword = await this.comparePassword(oldPassword);
    if (!matchedPassword) throw new BadRequestException('Old password is not correct.');

    this.password = await argon.hash(newPassword);
    await this.save();
    return this;
  }
}
