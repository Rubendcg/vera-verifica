import { DocumentFile } from '../entities/document-file.entity';
import { DocumentStorageKind } from '../entities/documents.enums';

export type WritableDocumentStorageKind =
  | DocumentStorageKind.LOCAL_PATH
  | DocumentStorageKind.OBJECT_STORAGE;

export interface StoreDocumentPdfInput {
  documentId: string;
  versionNo: number;
  originalFileName: string;
  mimeType: string;
  content: Buffer;
}

export interface StoredDocumentFileResult {
  storageKind: WritableDocumentStorageKind;
  storagePath: string;
  fileSizeBytes: number;
  sha256Hex: string;
}

export interface DocumentsStorageBackend {
  readonly storageKind: WritableDocumentStorageKind;
  storePdf(input: StoreDocumentPdfInput): Promise<StoredDocumentFileResult>;
  readFile(file: DocumentFile): Promise<Buffer>;
  deleteFile(file: Pick<DocumentFile, 'storagePath'>): Promise<void>;
}
