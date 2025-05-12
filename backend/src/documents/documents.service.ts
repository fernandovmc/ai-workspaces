import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';
import * as pdf from 'pdf-parse';
import * as util from 'util';
import { Workspace } from '../workspaces/workspace.entity';

const readFile = util.promisify(fs.readFile);

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    workspaceId: number,
  ): Promise<Document> {
    try {
      // Extract text content from the document
      let content = '';

      if (file.mimetype === 'application/pdf') {
        const dataBuffer = await readFile(file.path);
        const pdfData = await pdf(dataBuffer);
        content = pdfData.text;
      } else if (file.mimetype === 'text/plain') {
        content = await readFile(file.path, 'utf8');
      } else {
        // For other document types, we would need specific parsers
        // For simplicity, we'll just store a placeholder
        content = '(Content extraction not supported for this file type)';
      }

      const document = this.documentRepository.create({
        name: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        content: content,
        workspace: { id: workspaceId } as Workspace,
      });

      return this.documentRepository.save(document);
    } catch (error) {
      this.logger.error(
        `Error uploading document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getDocumentsByWorkspaceId(workspaceId: number): Promise<Document[]> {
    try {
      return this.documentRepository.find({
        where: { workspace: { id: workspaceId } },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching documents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getDocumentById(documentId: number): Promise<Document> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id: documentId },
        relations: ['workspace'],
      });

      if (!document) {
        throw new NotFoundException(`Document with ID ${documentId} not found`);
      }

      return document;
    } catch (error) {
      this.logger.error(
        `Error fetching document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getDocumentContentByIds(documentIds: number[]): Promise<string[]> {
    try {
      const documents = await this.documentRepository.findByIds(documentIds);
      return documents.map((doc) => doc.content);
    } catch (error) {
      this.logger.error(
        `Error fetching document contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteDocument(documentId: number): Promise<void> {
    try {
      const document = await this.getDocumentById(documentId);

      // Remove physical file
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      // Remove from database
      await this.documentRepository.remove(document);
    } catch (error) {
      this.logger.error(
        `Error deleting document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
