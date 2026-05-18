import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { basename, extname, join, relative, resolve } from 'path';
import { DocumentFile } from '../entities/document-file.entity';
import { DocumentStorageKind } from '../entities/documents.enums';
import {
  DocumentsStorageBackend,
  StoredDocumentFileResult,
  StoreDocumentPdfInput,
} from './documents-storage.types';

@Injectable()
export class LocalDocumentsStorageBackend implements DocumentsStorageBackend {
  readonly storageKind = DocumentStorageKind.LOCAL_PATH;

  async storePdf(input: StoreDocumentPdfInput): Promise<StoredDocumentFileResult> {
    const storageRoot = this.resolveStoredAbsolutePath(this.getDocumentsStorageRoot());
    const documentDir = join(storageRoot, input.documentId);
    await fs.mkdir(documentDir, { recursive: true });

    const normalizedName = this.buildNormalizedPdfName(input.originalFileName);
    const fileName = `v${String(input.versionNo).padStart(4, '0')}-${randomUUID()}-${normalizedName}`;
    const absolutePath = join(documentDir, fileName);

    await fs.writeFile(absolutePath, input.content);

    return {
      storageKind: this.storageKind,
      storagePath: relative(this.getWorkspaceRoot(), absolutePath).replace(/\\/g, '/'),
      fileSizeBytes: input.content.length,
      sha256Hex: createHash('sha256').update(input.content).digest('hex'),
    };
  }

  async readFile(file: DocumentFile) {
    const absolutePath = this.resolveStoredAbsolutePath(
      this.requireStoragePath(file.storagePath),
    );

    try {
      return await fs.readFile(absolutePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException(
          'No se encontro el archivo PDF almacenado en disco local.',
        );
      }

      throw error;
    }
  }

  async deleteFile(file: Pick<DocumentFile, 'storagePath'>) {
    const absolutePath = this.resolveStoredAbsolutePath(
      this.requireStoragePath(file.storagePath),
    );

    try {
      await fs.rm(absolutePath, { force: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private buildNormalizedPdfName(originalFileName: string) {
    const sanitizedBaseName = basename(originalFileName)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_');
    const extension = extname(sanitizedBaseName).toLowerCase();

    if (extension === '.pdf') {
      return sanitizedBaseName;
    }

    if (sanitizedBaseName.toLowerCase().endsWith('.pdf')) {
      return sanitizedBaseName;
    }

    return `${sanitizedBaseName || 'documento'}.pdf`;
  }

  private requireStoragePath(storagePath: string | null) {
    if (!storagePath?.trim()) {
      throw new BadRequestException('El archivo almacenado no tiene storagePath.');
    }

    return storagePath.trim();
  }

  private getDocumentsStorageRoot() {
    return process.env.DOCUMENTS_STORAGE_ROOT?.trim() || '.storage/documents';
  }

  private getWorkspaceRoot() {
    return resolve(process.cwd());
  }

  private resolveStoredAbsolutePath(storagePath: string) {
    const workspaceRoot = this.getWorkspaceRoot();
    const absolutePath = resolve(workspaceRoot, storagePath);

    if (!absolutePath.startsWith(workspaceRoot)) {
      throw new BadRequestException(
        'La ruta del archivo almacenado queda fuera del workspace permitido.',
      );
    }

    return absolutePath;
  }
}
