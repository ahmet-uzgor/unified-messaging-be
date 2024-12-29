import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { PlatformModule } from '../platforms/platform.module';
import { AiBotModule } from '../ai-bot/ai-bot.module';

@Module({
  imports: [PlatformModule, AiBotModule],
  controllers: [MessagesController],
})
export class MessageModule {}
