import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  members!: number[];
}
