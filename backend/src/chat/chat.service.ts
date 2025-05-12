import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { OpenaiService } from '../openai/openai.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
    private openaiService: OpenaiService,
    private documentsService: DocumentsService,
  ) {}

  async processContextualMessage(workspaceId: string, messageContent: string) {
    this.logger.debug(
      `Processing contextual message for workspace ${workspaceId}`,
    );

    try {
      // Save user message
      const userMessage = await this.saveChatMessage({
        workspaceId,
        content: messageContent,
        role: 'user',
        mode: 'contextual',
      });

      // Get workspace documents for context
      const documents = await this.documentsService.getDocumentsByWorkspaceId(
        parseInt(workspaceId),
      );
      const documentContents = documents.map((doc) => doc.content);

      if (documentContents.length === 0) {
        this.logger.warn(`No documents found for workspace ${workspaceId}`);
      }

      // Get chat history for context
      const chatHistory = await this.getChatHistory(workspaceId, 'contextual');
      const formattedHistory = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate response from OpenAI with document context
      const aiResponse = await this.openaiService.generateChatResponse(
        formattedHistory,
        documentContents,
      );

      // Save AI response
      const assistantMessage = await this.saveChatMessage({
        workspaceId,
        content: aiResponse || 'Não foi possível gerar uma resposta.',
        role: 'assistant',
        mode: 'contextual',
      });

      return assistantMessage;
    } catch (error) {
      this.logger.error(
        `Error processing contextual message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async processPersonalMessage(workspaceId: string, messageContent: string) {
    this.logger.debug(
      `Processing personal message for workspace ${workspaceId}`,
    );

    try {
      // Save user message
      const userMessage = await this.saveChatMessage({
        workspaceId,
        content: messageContent,
        role: 'user',
        mode: 'personal',
      });

      // Get chat history without document context
      const chatHistory = await this.getChatHistory(workspaceId, 'personal');
      const formattedHistory = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate response from OpenAI without additional context
      const aiResponse =
        await this.openaiService.generateChatResponse(formattedHistory);

      // Save AI response
      const assistantMessage = await this.saveChatMessage({
        workspaceId,
        content: aiResponse || 'Não foi possível gerar uma resposta.',
        role: 'assistant',
        mode: 'personal',
      });

      return assistantMessage;
    } catch (error) {
      this.logger.error(
        `Error processing personal message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getChatHistory(
    workspaceId: string,
    mode: 'contextual' | 'personal',
    limit: number = 50,
  ) {
    this.logger.debug(
      `Fetching ${mode} chat history for workspace ${workspaceId}`,
    );

    try {
      return this.chatMessagesRepository.find({
        where: {
          workspaceId,
          mode,
        },
        order: {
          createdAt: 'ASC',
        },
        take: limit,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching chat history: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async saveChatMessage(data: {
    workspaceId: string;
    content: string;
    role: 'user' | 'assistant';
    mode: 'contextual' | 'personal';
  }) {
    this.logger.debug(
      `Saving ${data.role} message in ${data.mode} mode for workspace ${data.workspaceId}`,
    );

    try {
      const message = this.chatMessagesRepository.create({
        ...data,
        createdAt: new Date(),
      });

      return this.chatMessagesRepository.save(message);
    } catch (error) {
      this.logger.error(
        `Error saving chat message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
