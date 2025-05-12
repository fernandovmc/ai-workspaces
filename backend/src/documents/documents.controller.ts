import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Document } from './document.entity';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller('workspaces/:workspaceId/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.documentsService.uploadDocument(file, workspaceId);
  }

  @Get()
  async getDocumentsByWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Document[]> {
    return this.documentsService.getDocumentsByWorkspaceId(workspaceId);
  }

  @Get(':id')
  async getDocumentById(
    @Param('id', ParseIntPipe) id: number,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Document> {
    const document = await this.documentsService.getDocumentById(id);

    // Ensure document belongs to the specified workspace
    if (document.workspace.id !== workspaceId) {
      throw new NotFoundException('Document not found in this workspace');
    }

    return document;
  }

  @Delete(':id')
  async deleteDocument(
    @Param('id') id: string,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Convert string ID to number
      const documentId = parseInt(id, 10);

      if (isNaN(documentId)) {
        throw new BadRequestException('Invalid document ID format');
      }

      const document = await this.documentsService.getDocumentById(documentId);

      // Ensure document belongs to the specified workspace
      if (document.workspace.id !== workspaceId) {
        throw new NotFoundException('Document not found in this workspace');
      }

      await this.documentsService.deleteDocument(documentId);

      return {
        success: true,
        message: 'Document successfully deleted',
      };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}
