import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateChatResponse(messages: any[], contextualDocuments?: string[]) {
    try {
      let systemMessage = 'Você é um assistente útil e prestativo.';

      if (contextualDocuments && contextualDocuments.length > 0) {
        systemMessage = `Você é um assistente útil e prestativo. Responda às perguntas com base no seguinte contexto: 
        ${contextualDocuments.join('\n\n')}`;
      }

      const finalMessages = [
        {
          role: 'system',
          content: systemMessage,
        },
        ...messages.slice(-10),
      ];

      this.logger.debug(
        `Calling OpenAI API with ${finalMessages.length} messages`,
      );

      const response = await this.openai.chat.completions.create({
        model:
          this.configService.get<string>('OPENAI_MODEL') || 'gpt-3.5-turbo',
        messages: finalMessages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      this.logger.debug('Successfully received response from OpenAI API');
      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(
        `Erro ao chamar a API da OpenAI: ${error.message}`,
        error.stack,
      );

      if (error.response) {
        this.logger.error(
          `OpenAI API error: ${JSON.stringify(error.response.data)}`,
        );
      }

      throw new Error('Falha ao gerar resposta da IA: ' + error.message);
    }
  }
}
