import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AiService, ChatMessage, ChatResponse } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class PersonalChatDto {
  messages: ChatMessage[];
}

class ContextualChatDto {
  messages: ChatMessage[];
  documentIds: number[];
}

@Controller('workspaces/:workspaceId/ai-chat')
@UseGuards(JwtAuthGuard)
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('personal')
  async personalChat(
    @Body() chatDto: PersonalChatDto,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<ChatResponse> {
    this.logger.log(`Personal chat request in workspace ${workspaceId}`);

    if (!chatDto.messages || !chatDto.messages.length) {
      throw new BadRequestException('Messages are required');
    }

    return this.aiService.personalChat(chatDto.messages);
  }

  @Post('contextual')
  async contextualChat(
    @Body() chatDto: ContextualChatDto,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<ChatResponse> {
    this.logger.log(`Contextual chat request in workspace ${workspaceId} with ${chatDto.documentIds?.length || 0} documents`);

    if (!chatDto.messages || !chatDto.messages.length) {
      throw new BadRequestException('Messages are required');
    }

    if (!chatDto.documentIds || !chatDto.documentIds.length) {
      throw new BadRequestException('Document IDs are required for contextual chat');
    }

    return this.aiService.contextualChat(chatDto.messages, chatDto.documentIds);
  }
}