import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  roomId!: number;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
  @IsString()
  @IsNotEmpty()
  text!: string;
  @IsOptional()
  @IsString({ each: true })
  attachments: string[];
}
