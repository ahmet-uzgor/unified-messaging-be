import { Module } from '@nestjs/common';
import { AIBotService } from './ai-bot.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AIBotService],
  exports: [AIBotService],
})
export class AiBotModule {}
