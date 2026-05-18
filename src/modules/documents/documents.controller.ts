import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireAdmin } from '../auth/decorators/require-admin.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentFileDto } from './dto/create-document-file.dto';
import { MigrateDocumentStorageDto } from './dto/migrate-document-storage.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { DocumentsService } from './documents.service';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  listDocuments(
    @Query() query: QueryDocumentsDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.documentsService.listDocuments(query, currentUser);
  }

  @Get('summary')
  getModuleSummary() {
    return this.documentsService.getModuleSummary();
  }

  @Get('catalogs')
  getCatalogs() {
    return this.documentsService.getCatalogs();
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('storage/object/probe')
  probeObjectStorage() {
    return this.documentsService.probeObjectStorage();
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('storage/object/migrate')
  migrateLocalFilesToObjectStorage(@Body() dto: MigrateDocumentStorageDto) {
    return this.documentsService.migrateLocalFilesToObjectStorage(dto);
  }

  @Get(':id')
  getDocumentById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.documentsService.getDocumentById(id, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post()
  createDocument(
    @Body() dto: CreateDocumentDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.documentsService.createDocument(dto, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post(':id/files')
  addDocumentFileVersion(
    @Param('id') id: string,
    @Body() dto: CreateDocumentFileDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.documentsService.addDocumentFileVersion(id, dto, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post(':id/files/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  uploadDocumentPdf(
    @Param('id') id: string,
    @UploadedFile()
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.documentsService.uploadDocumentPdf(id, file, currentUser);
  }

  @Get(':id/files/current/download')
  async downloadCurrentDocumentFile(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const download = await this.documentsService.downloadCurrentDocumentFile(
      id,
      currentUser,
    );

    response.setHeader('Content-Type', download.mimeType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${download.fileName}"`,
    );

    return new StreamableFile(download.content);
  }
}
