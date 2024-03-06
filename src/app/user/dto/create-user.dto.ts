import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString({
    each: true,
  })
  name: string;

  @ApiProperty()
  @IsInt({
    each: true,
  })
  age: number;
}
