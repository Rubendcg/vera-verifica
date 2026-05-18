import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentFile } from '../entities/document-file.entity';
import { DocumentStorageKind } from '../entities/documents.enums';
import { LocalDocumentsStorageBackend } from './local-documents-storage.backend';
import { ObjectStorageDocumentsStorageBackend } from './object-storage-documents-storage.backend';
import {
  DocumentsStorageBackend,
  StoredDocumentFileResult,
  StoreDocumentPdfInput,
  WritableDocumentStorageKind,
} from './documents-storage.types';

@Injectable()
export class DocumentsStorageService {
  private readonly backends: Map<WritableDocumentStorageKind, DocumentsStorageBackend>;

  constructor(
    private readonly localBackend: LocalDocumentsStorageBackend,
    private readonly objectStorageBackend: ObjectStorageDocumentsStorageBackend,
  ) {
    this.backends = new Map<WritableDocumentStorageKind, DocumentsStorageBackend>([
      [this.localBackend.storageKind, this.localBackend],
      [this.objectStorageBackend.storageKind, this.objectStorageBackend],
    ]);
  }

  async storePdf(input: StoreDocumentPdfInput): Promise<StoredDocumentFileResult> {
    return this.getWriteBackend().storePdf(input);
  }

  async readFile(file: DocumentFile) {
    return this.getBackend(file.storageKind).readFile(file);
  }

  async deleteStoredFile(file: Pick<DocumentFile, 'storageKind' | 'storagePath'>) {
    if (file.storageKind === DocumentStorageKind.DATABASE) {
      return;
    }

    await this.getBackend(file.storageKind).deleteFile(file);
  }

  async probeObjectStorageConnectivity() {
    return this.objectStorageBackend.probeConnectivity();
  }

  async storePdfInObjectStorage(input: StoreDocumentPdfInput) {
    return this.objectStorageBackend.storePdf(input);
  }

  private getWriteBackend() {
    return this.getBackend(this.getDefaultWriteStorageKind());
  }

  private getDefaultWriteStorageKind(): WritableDocumentStorageKind {
    const configured = process.env.DOCUMENTS_STORAGE_DRIVER?.trim();

    if (!configured || configured === DocumentStorageKind.LOCAL_PATH) {
      return DocumentStorageKind.LOCAL_PATH;
    }

    if (configured === DocumentStorageKind.OBJECT_STORAGE) {
      return DocumentStorageKind.OBJECT_STORAGE;
    }

    throw new BadRequestException(
      'DOCUMENTS_STORAGE_DRIVER debe ser LOCAL_PATH u OBJECT_STORAGE.',
    );
  }

  private getBackend(storageKind: DocumentStorageKind): DocumentsStorageBackend {
    if (storageKind === DocumentStorageKind.DATABASE) {
      throw new BadRequestException(
        'El contenido almacenado en base de datos no usa backend de archivos externo.',
      );
    }

    const backend = this.backends.get(storageKind);
    if (!backend) {
      throw new BadRequestException(
        `No existe un backend configurado para storageKind ${storageKind}.`,
      );
    }

    return backend;
  }
}
