import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessagesController } from './messages/messages.controller';
import { MessageModule } from './messages/message.module';
import { PlatformModule } from './platforms/platform.module';
import { AiBotModule } from './ai-bot/ai-bot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';

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
  ],
  controllers: [AppController, MessagesController],
})
export class AppModule {}
