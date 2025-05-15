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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'production'
        ? {
            // Production configuration with DATABASE_URL
            url: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            // Local development configuration with individual parameters
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'ai_workspaces',
          }),
      entities: [User, Workspace, Document, ChatMessage],
      synchronize: true,
      logging: ['error'],
      // Opções extras para garantir a conexão
      extra: {
        connectionTimeoutMillis: 5000,
        query_timeout: 10000,
      },
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
