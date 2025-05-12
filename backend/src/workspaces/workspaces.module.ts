import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceService } from './workspace.service';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Document } from '../documents/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, ChatMessage, Document])],
  controllers: [WorkspacesController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspacesModule {}
