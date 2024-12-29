import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './message.service';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages from all platforms' })
  @ApiResponse({ status: 200, description: 'Return all messages.' })
  async getAllMessages() {
    try {
      return await this.messagesService.getAllMessages();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a message to a specific platform' })
  @ApiResponse({ status: 200, description: 'Message sent successfully.' })
  async sendMessage(
    @Body() data: { platform: string; recipientId: string; message: string },
  ) {
    try {
      const { platform, recipientId, message } = data;
      return await this.messagesService.sendMessage(
        platform,
        recipientId,
        message,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('ai-response')
  @ApiOperation({ summary: 'Get AI-generated response for a message' })
  @ApiResponse({
    status: 200,
    description: 'AI response generated successfully.',
  })
  async getAIResponse(@Body() data: { message: string }) {
    try {
      return await this.messagesService.getAIResponse(data.message);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
