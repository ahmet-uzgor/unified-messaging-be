import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Platform to send message to',
    enum: ['instagram', 'whatsapp'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['instagram', 'whatsapp'])
  platform: string;

  @ApiProperty({
    description: 'Recipient ID (user ID or phone number)',
  })
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({
    description: 'Message content',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
