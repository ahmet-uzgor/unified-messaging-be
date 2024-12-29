import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FAQService } from 'src/faqs/faqs.service';

@Injectable()
export class AIBotService {
  private readonly anthropic: Anthropic;

  constructor(
    private configService: ConfigService,
    private faqService: FAQService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('anthropic.apiKey'),
    });
  }

  async getResponse(message: string) {
    try {
      // Get FAQs from database
      const faqs = await this.faqService.getAllFAQs();
      const faqContext = faqs
        .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
        .join('\n\n');

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Given these frequently asked questions and answers:
          
          ${faqContext}

          Please provide a helpful response to this customer message, using the FAQs as a guide:
          "${message}"
          
          If the message doesn't match any FAQ, provide a friendly response based on the general context.`,
          },
        ],
      });

      return response.content;
    } catch (error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }
}
