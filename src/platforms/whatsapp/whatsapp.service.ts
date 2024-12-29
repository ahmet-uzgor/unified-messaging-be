import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('whatsapp.accessToken');
    this.phoneNumberId = this.configService.get<string>(
      'whatsapp.phoneNumberId',
    );
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async getMessages() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          params: { access_token: this.accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`WhatsApp API Error: ${error.message}`);
    }
  }

  async sendMessage(phoneNumber: string, message: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`WhatsApp Send Message Error: ${error.message}`);
    }
  }
}
