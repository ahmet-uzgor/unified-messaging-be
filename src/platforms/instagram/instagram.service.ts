import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class InstagramService {
  private readonly accessToken: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('instagram.accessToken');
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async getMessages() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/conversations`, {
        params: {
          access_token: this.accessToken,
          fields: 'participants,messages{message,created_time,from}',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Instagram API Error: ${error.message}`);
    }
  }

  async sendMessage(userId: string, message: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/me/messages`,
        {
          recipient: { id: userId },
          message: { text: message },
        },
        {
          params: { access_token: this.accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Instagram Send Message Error: ${error.message}`);
    }
  }
}
