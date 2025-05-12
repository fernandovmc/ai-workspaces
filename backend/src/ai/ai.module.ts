import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { DocumentsModule } from '../documents/documents.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DocumentsModule, ConfigModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
