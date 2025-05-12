import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('workspaces/:workspaceId/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private chatService: ChatService) {}

  @Post('contextual')
  async createContextualMessage(
    @Param('workspaceId') workspaceId: string,
    @Body() chatMessageDto: ChatMessageDto,
  ) {
    this.logger.log(`Received contextual message for workspace ${workspaceId}`);
    try {
      const result = await this.chatService.processContextualMessage(
        workspaceId,
        chatMessageDto.text,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error processing contextual message: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to process contextual message: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('personal')
  async createPersonalMessage(
    @Param('workspaceId') workspaceId: string,
    @Body() chatMessageDto: ChatMessageDto,
  ) {
    this.logger.log(`Received personal message for workspace ${workspaceId}`);
    try {
      const result = await this.chatService.processPersonalMessage(
        workspaceId,
        chatMessageDto.text,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error processing personal message: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to process personal message: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('contextual')
  async getContextualHistory(@Param('workspaceId') workspaceId: string) {
    this.logger.log(
      `Fetching contextual chat history for workspace ${workspaceId}`,
    );
    try {
      return await this.chatService.getChatHistory(workspaceId, 'contextual');
    } catch (error) {
      this.logger.error(
        `Error fetching contextual chat history: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to fetch contextual chat history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('personal')
  async getPersonalHistory(@Param('workspaceId') workspaceId: string) {
    this.logger.log(
      `Fetching personal chat history for workspace ${workspaceId}`,
    );
    try {
      return await this.chatService.getChatHistory(workspaceId, 'personal');
    } catch (error) {
      this.logger.error(
        `Error fetching personal chat history: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to fetch personal chat history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
