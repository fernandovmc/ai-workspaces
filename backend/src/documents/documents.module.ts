import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Workspace } from '../workspaces/workspace.entity';
import { Request } from 'express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Workspace]),
    MulterModule.register({
      storage: diskStorage({
        destination: (
          _req: Request,
          _file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          // Use tmp directory for Railway compatibility
          // Railway provides /tmp as a writable directory
          const uploadPath =
            process.env.NODE_ENV === 'production'
              ? '/tmp/uploads'
              : './uploads';

          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (
          _req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          // Create a unique filename with timestamp
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        // Only allow certain file types
        if (
          file.mimetype.match(
            /\/(pdf|plain|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
          )
        ) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
      },
    }),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
