import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  roomId!: number;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
  @IsString()
  text!: string;
  @IsOptional()
  attachments: string[];
}
