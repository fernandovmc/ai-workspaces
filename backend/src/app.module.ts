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
      // Prioriza DATABASE_URL se disponível (formato completo para Railway)
      url: process.env.DATABASE_URL,
      // Configurações individuais (usadas se DATABASE_URL não estiver disponível)
      host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
      username: process.env.DB_USERNAME || process.env.PGUSER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres',
      database:
        process.env.DB_DATABASE || process.env.PGDATABASE || 'ai_workspaces',
      entities: [User, Workspace, Document, ChatMessage],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
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
