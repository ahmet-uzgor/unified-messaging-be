import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Anthropic } from '@anthropic-ai/sdk';
import { ContentBlock } from '@anthropic-ai/sdk/resources';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AIBotService implements OnModuleInit {
  private readonly anthropic: Anthropic;
  private systemContext: string;
  private conversation: ConversationMessage[];

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('anthropic.apiKey'),
    });
    this.conversation = [];
  }

  async onModuleInit() {
    await this.initializeAIContext();
  }

  private async initializeAIContext() {
    try {
      // Get FAQs from database
      const faqs = await this.prisma.fAQ.findMany();

      // Create the system context
      this.systemContext = `You are a customer service AI assistant. You'll be helping customers based on the following FAQ knowledge:

${faqs
  .map((faq) => `Question: ${faq.question}\nAnswer: ${faq.answer}`)
  .join('\n\n')}

When responding to customer queries:
1. Always try to match the question with the most relevant FAQ
2. If there's no exact match, use the FAQ knowledge to provide a relevant response
3. If the question is completely unrelated to any FAQ, politely explain that you can't help with that specific query
4. Keep responses concise and professional
5. Always maintain a helpful and friendly tone

Do you understand these instructions?`;

      // Initialize the conversation with the system context
      const initialResponse = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: this.systemContext,
          },
        ],
      });

      // Store the initial conversation
      this.conversation = [
        { role: 'user', content: this.systemContext },
        {
          role: 'assistant',
          content: (initialResponse.content as unknown as ContentBlock)[0].text,
        },
      ];

      console.log('AI Context initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI context:', error);
      throw error;
    }
  }

  async updateFAQContext() {
    await this.initializeAIContext();
  }

  async getResponse(userMessage: string): Promise<string> {
    try {
      // Add user message to conversation
      this.conversation.push({ role: 'user', content: userMessage });

      // Keep only last 10 messages to prevent context from getting too large
      if (this.conversation.length > 10) {
        // Always keep the system context and its response (first 2 messages)
        this.conversation = [
          ...this.conversation.slice(0, 2),
          ...this.conversation.slice(-8),
        ];
      }

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: this.conversation.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // Get the response text
      const responseText = (response.content as unknown as ContentBlock)[0]
        .text;

      // Add AI response to conversation history
      this.conversation.push({
        role: 'assistant',
        content: responseText,
      });

      return responseText;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }
}
