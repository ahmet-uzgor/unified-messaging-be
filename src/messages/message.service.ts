import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstagramService } from '../platforms/instagram/instagram.service';
import { WhatsAppService } from '../platforms/whatsapp/whatsapp.service';
import { AIBotService } from '../ai-bot/ai-bot.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly instagramService: InstagramService,
    private readonly whatsappService: WhatsAppService,
    private readonly aiService: AIBotService,
  ) {}

  async getAllMessages() {
    try {
      const [instagramMessages, whatsappMessages] = await Promise.all([
        this.instagramService.getMessages(),
        this.whatsappService.getMessages(),
      ]);

      // Process and normalize messages
      // Store in database
      return {
        instagram: instagramMessages,
        whatsapp: whatsappMessages,
      };
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async sendMessage(platform: string, recipientId: string, message: string) {
    try {
      let response;

      if (platform === 'instagram') {
        response = await this.instagramService.sendMessage(
          recipientId,
          message,
        );
      } else if (platform === 'whatsapp') {
        response = await this.whatsappService.sendMessage(recipientId, message);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
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
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getAIResponse(message: string) {
    try {
      return this.aiService.getResponse(message);
    } catch (error) {
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }
}
