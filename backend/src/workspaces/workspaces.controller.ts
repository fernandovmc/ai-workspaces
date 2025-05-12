import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../common/types/request.types';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkspaceResponseDto } from './dto/workspace-response.dto';

interface CreateWorkspaceDto {
  name: string;
}

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWorkspace(
    @Body() body: CreateWorkspaceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = parseInt(req.user.sub);
    return this.workspaceService.createWorkspace(body.name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserWorkspaces(
    @Req() req: AuthenticatedRequest,
  ): Promise<WorkspaceResponseDto[]> {
    const userId = parseInt(req.user.sub);
    return this.workspaceService.getWorkspacesByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<WorkspaceResponseDto> {
    const userId = parseInt(req.user.sub);
    return this.workspaceService.getWorkspaceById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const userId = parseInt(req.user.sub);
    return this.workspaceService.deleteWorkspace(id, userId);
  }
}
