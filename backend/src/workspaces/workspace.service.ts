import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { WorkspaceResponseDto } from './dto/workspace-response.dto';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Document } from '../documents/document.entity';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly dataSource: DataSource,
  ) {}

  async createWorkspace(name: string, userId: number): Promise<Workspace> {
    const workspace = this.workspaceRepository.create({
      name,
      user: { id: userId } as User,
    });
    return this.workspaceRepository.save(workspace);
  }

  async getWorkspacesByUserId(userId: number): Promise<WorkspaceResponseDto[]> {
    this.logger.debug(`Fetching workspaces for user ID: ${userId}`);

    try {
      const workspaces = await this.workspaceRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      this.logger.debug(
        `Found ${workspaces.length} workspaces for user ID: ${userId}`,
      );

      return workspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Error fetching workspaces: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async getWorkspaceById(
    workspaceId: number,
    userId: number,
  ): Promise<WorkspaceResponseDto> {
    this.logger.debug(
      `Fetching workspace ID: ${workspaceId} for user ID: ${userId}`,
    );

    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: workspaceId, user: { id: userId } },
        relations: ['user'],
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ID: ${workspaceId} not found or does not belong to user ID: ${userId}`,
        );
        throw new NotFoundException(
          `Workspace with ID ${workspaceId} not found`,
        );
      }

      return {
        id: workspace.id,
        name: workspace.name,
      };
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';

        this.logger.error(
          `Error fetching workspace: ${errorMessage}`,
          errorStack,
        );
      }
      throw error;
    }
  }

  async deleteWorkspace(workspaceId: number, userId: number): Promise<void> {
    this.logger.debug(
      `Attempting to delete workspace ID: ${workspaceId} for user ID: ${userId}`,
    );

    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: workspaceId, user: { id: userId } },
      });

      if (!workspace) {
        this.logger.warn(
          `Workspace ID: ${workspaceId} not found or does not belong to user ID: ${userId}`,
        );
        throw new NotFoundException(
          `Workspace with ID ${workspaceId} not found`,
        );
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const workspaceIdStr = workspaceId.toString();

        const chatCount = await queryRunner.manager.query(
          `SELECT COUNT(*) FROM chat_message WHERE "workspaceId" = $1`,
          [workspaceIdStr],
        );

        this.logger.debug(
          `Found ${chatCount[0].count} chat messages for workspace ID: ${workspaceId}`,
        );

        if (parseInt(chatCount[0].count) > 0) {
          await queryRunner.manager.query(
            `DELETE FROM chat_message WHERE "workspaceId" = $1`,
            [workspaceIdStr],
          );
          this.logger.debug(
            `Deleted chat messages for workspace ID: ${workspaceId}`,
          );
        }

        const docCount = await queryRunner.manager.query(
          `SELECT column_name FROM information_schema.columns 
           WHERE table_name = 'document' 
           AND column_name LIKE '%workspace%'`,
        );

        if (docCount.length > 0) {
          const workspaceColumnName = docCount[0].column_name;
          this.logger.debug(
            `Found workspace column in document table: ${workspaceColumnName}`,
          );

          await queryRunner.manager.query(
            `DELETE FROM document WHERE "${workspaceColumnName}" = $1`,
            [workspaceId],
          );
        } else {
          await queryRunner.manager.query(
            `DELETE FROM document WHERE "workspaceId" = $1`,
            [workspaceId],
          );
        }

        await queryRunner.manager.query(`DELETE FROM workspace WHERE id = $1`, [
          workspaceId,
        ]);
        this.logger.debug(`Successfully deleted workspace ID: ${workspaceId}`);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;

        this.logger.error(
          `Transaction failed during workspace deletion: ${errorMessage}`,
          errorStack,
        );
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';

        this.logger.error(
          `Error deleting workspace: ${errorMessage}`,
          errorStack,
        );
      }
      throw error;
    }
  }
}
