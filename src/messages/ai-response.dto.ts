import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AIResponseDto {
  @ApiProperty({
    description: 'Message to get AI response for',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
