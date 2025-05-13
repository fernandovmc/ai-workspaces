import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { User } from './users/user.entity';
import { Workspace } from './workspaces/workspace.entity';
import { Document } from './documents/document.entity';
import { DocumentsModule } from './documents/documents.module';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat/chat.module';
import { OpenaiModule } from './openai/openai.module';
import { ChatMessage } from './chat/entities/chat-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Suporte para URL do Railway ou variáveis individuais
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'ai_workspaces',
      entities: [User, Workspace, Document, ChatMessage],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false
    }),
    AuthModule,
    UserModule,
    WorkspacesModule,
    DocumentsModule,
    AiModule,
    ChatModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
