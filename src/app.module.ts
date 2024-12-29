import { Module } from '@nestjs/common';
import { MessageModule } from './messages/message.module';
import { PlatformModule } from './platforms/platform.module';
import { AiBotModule } from './ai-bot/ai-bot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { FAQModule } from './faqs/faqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    PlatformModule,
    AiBotModule,
    MessageModule,
    FAQModule,
  ],
})
export class AppModule {}
