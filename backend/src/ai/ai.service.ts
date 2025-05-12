import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { DocumentsService } from '../documents/documents.service';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  answer: string;
  citations?: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly documentsService: DocumentsService) {}

  async personalChat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '';

      return {
        answer: content,
      };
    } catch (error) {
      this.logger.error(
        `Error in personal chat: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async contextualChat(
    messages: ChatMessage[],
    documentIds: number[],
  ): Promise<ChatResponse> {
    try {
      // Retrieve document contents
      const documentContents =
        await this.documentsService.getDocumentContentByIds(documentIds);

      if (!documentContents.length) {
        throw new Error('No document content available');
      }

      // Create a system message with document context
      const contextMessage: ChatMessage = {
        role: 'system',
        content: `You are an AI assistant with access to the following documents. 
        Use this context to answer the user's questions accurately.
        
        Document contents:
        ${documentContents.join('\n\n---\n\n')}`,
      };

      // Add the context as the first message
      const messagesWithContext = [contextMessage, ...messages];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messagesWithContext,
        temperature: 0.3, // Lower temperature for more factual responses
      });

      const content = response.choices[0].message.content || '';

      return {
        answer: content,
        citations: this.extractCitations(content, documentContents),
      };
    } catch (error) {
      this.logger.error(
        `Error in contextual chat: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private extractCitations(
    answer: string,
    documentContents: string[],
  ): string[] {
    // A simplistic approach to extract potential citation sources
    // Real-world implementation would use embedding similarity or other more robust approaches
    const citations: string[] = [];

    // Split the document contents into paragraphs for more granular matching
    const paragraphs = documentContents.flatMap((doc) =>
      doc.split('\n\n').filter((p) => p.trim().length > 0),
    );

    // Look for direct quotes or paraphrases
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    for (const sentence of sentences) {
      for (const paragraph of paragraphs) {
        // If we find significant overlap between the answer and a paragraph
        if (this.calculateOverlap(sentence, paragraph) > 0.7) {
          // Add a snippet of the paragraph as a citation
          const snippet =
            paragraph.substring(0, 100) + (paragraph.length > 100 ? '...' : '');
          if (!citations.includes(snippet)) {
            citations.push(snippet);
          }
          break;
        }
      }
    }

    return citations;
  }

  private calculateOverlap(text1: string, text2: string): number {
    // Simple overlap calculation - count shared words
    const words1 = text1.toLowerCase().split(/\W+/).filter(Boolean);
    const words2 = text2.toLowerCase().split(/\W+/).filter(Boolean);

    if (words1.length === 0 || words2.length === 0) return 0;

    const set2 = new Set(words2);
    const sharedWords = words1.filter((word) => set2.has(word)).length;

    return sharedWords / Math.min(words1.length, words2.length);
  }
}
