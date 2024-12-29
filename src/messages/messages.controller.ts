import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AIBotService } from '../ai-bot/ai-bot.service';
import { InstagramService } from '../platforms/instagram/instagram.service';
import { WhatsAppService } from '../platforms/whatsapp/whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(
    private readonly instagramService: InstagramService,
    private readonly whatsappService: WhatsAppService,
    private readonly aiService: AIBotService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getAllMessages() {
    return this.instagramService.getMessages();
    // Process and normalize messages
    // Store in database
    // Return unified format
  }

  @Post('send')
  async sendMessage(
    @Body() data: { platform: string; recipientId: string; message: string },
  ) {
    const { platform, recipientId, message } = data;

    let response;
    if (platform === 'instagram') {
      response = await this.instagramService.sendMessage(recipientId, message);
    } else if (platform === 'whatsapp') {
      response = await this.whatsappService.sendMessage(recipientId, message);
    }

    // Store in database
    await this.prisma.message.create({
      data: {
        platform,
        externalId: response.id,
        senderId: recipientId,
        content: message,
        status: 'sent',
      },
    });

    return response;
  }

  @Post('ai-response')
  async getAIResponse(@Body() data: { message: string }) {
    return this.aiService.getResponse(data.message);
  }
}
