import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createHash, randomUUID } from 'crypto';
import { basename, extname } from 'path';
import { DocumentFile } from '../entities/document-file.entity';
import { DocumentStorageKind } from '../entities/documents.enums';
import {
  DocumentsStorageBackend,
  StoredDocumentFileResult,
  StoreDocumentPdfInput,
} from './documents-storage.types';

interface ObjectStorageClientLike {
  send(command: unknown): Promise<unknown>;
}

@Injectable()
export class ObjectStorageDocumentsStorageBackend
  implements DocumentsStorageBackend
{
  readonly storageKind = DocumentStorageKind.OBJECT_STORAGE;
  private client: ObjectStorageClientLike | null;

  constructor() {
    this.client = null;
  }

  static forTesting(client: ObjectStorageClientLike) {
    const backend = new ObjectStorageDocumentsStorageBackend();
    backend.client = client;
    return backend;
  }

  async probeConnectivity() {
    const objectKey = `${this.getPrefix()}__healthchecks__/probe-${Date.now()}-${randomUUID()}.txt`;
    const payload = Buffer.from(
      JSON.stringify({
        source: 'vera-documents-probe',
        timestamp: new Date().toISOString(),
      }),
      'utf-8',
    );

    let downloadedBytes = 0;
    let deleted = false;

    try {
      await this.getClient().send(
        new PutObjectCommand({
          Bucket: this.getBucket(),
          Key: objectKey,
          Body: payload,
          ContentType: 'application/json',
        }),
      );

      const response = (await this.getClient().send(
        new GetObjectCommand({
          Bucket: this.getBucket(),
          Key: objectKey,
        }),
      )) as { Body?: { transformToByteArray(): Promise<Uint8Array> } };

      if (!response.Body) {
        throw new NotFoundException(
          'El objeto de prueba no pudo leerse desde OBJECT_STORAGE.',
        );
      }

      const bytes = Buffer.from(await response.Body.transformToByteArray());
      downloadedBytes = bytes.length;

      if (!bytes.equals(payload)) {
        throw new InternalServerErrorException(
          'El probe de OBJECT_STORAGE devolvio contenido distinto al subido.',
        );
      }

      await this.getClient().send(
        new DeleteObjectCommand({
          Bucket: this.getBucket(),
          Key: objectKey,
        }),
      );
      deleted = true;

      return {
        storageKind: this.storageKind,
        bucket: this.getBucket(),
        endpoint: this.getEndpoint(),
        prefix: this.getPrefix(),
        objectKey,
        uploadedBytes: payload.length,
        downloadedBytes,
        deleted,
      };
    } catch (error) {
      if (!deleted) {
        await this.tryDeleteProbeObject(objectKey);
      }

      throw error;
    }
  }

  async storePdf(input: StoreDocumentPdfInput): Promise<StoredDocumentFileResult> {
    const normalizedName = this.buildNormalizedPdfName(input.originalFileName);
    const storagePath = `${this.getPrefix()}${input.documentId}/v${String(input.versionNo).padStart(4, '0')}-${randomUUID()}-${normalizedName}`;
    const sha256Hex = createHash('sha256').update(input.content).digest('hex');

    await this.getClient().send(
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: storagePath,
        Body: input.content,
        ContentType: input.mimeType,
        Metadata: {
          documentId: input.documentId,
          sha256hex: sha256Hex,
        },
      }),
    );

    return {
      storageKind: this.storageKind,
      storagePath,
      fileSizeBytes: input.content.length,
      sha256Hex,
    };
  }

  async readFile(file: DocumentFile) {
    const storagePath = this.requireStoragePath(file.storagePath);

    try {
      const response = (await this.getClient().send(
        new GetObjectCommand({
          Bucket: this.getBucket(),
          Key: storagePath,
        }),
      )) as { Body?: { transformToByteArray(): Promise<Uint8Array> } };

      if (!response.Body) {
        throw new NotFoundException(
          'No se encontro el archivo PDF en OBJECT_STORAGE.',
        );
      }

      const bytes = await response.Body.transformToByteArray();
      return Buffer.from(bytes);
    } catch (error) {
      if (error instanceof NoSuchKey) {
        throw new NotFoundException(
          'No se encontro el archivo PDF en OBJECT_STORAGE.',
        );
      }

      throw error;
    }
  }

  async deleteFile(file: Pick<DocumentFile, 'storagePath'>) {
    await this.getClient().send(
      new DeleteObjectCommand({
        Bucket: this.getBucket(),
        Key: this.requireStoragePath(file.storagePath),
      }),
    );
  }

  private getClient() {
    if (!this.client) {
      this.client = this.createClientFromEnv();
    }

    return this.client;
  }

  private getBucket() {
    return this.requireEnv('DOCUMENTS_S3_BUCKET');
  }

  private getPrefix() {
    return this.normalizePrefix(process.env.DOCUMENTS_S3_PREFIX);
  }

  private getEndpoint() {
    return process.env.DOCUMENTS_S3_ENDPOINT?.trim() || null;
  }

  private createClientFromEnv() {
    const endpoint = process.env.DOCUMENTS_S3_ENDPOINT?.trim() || undefined;
    const region = this.requireEnv('DOCUMENTS_S3_REGION');
    const accessKeyId = this.requireEnv('DOCUMENTS_S3_ACCESS_KEY_ID');
    const secretAccessKey = this.requireEnv('DOCUMENTS_S3_SECRET_ACCESS_KEY');

    return new S3Client({
      region,
      endpoint,
      forcePathStyle: this.parseBoolean(
        process.env.DOCUMENTS_S3_FORCE_PATH_STYLE,
        Boolean(endpoint),
      ),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private normalizePrefix(value: string | undefined) {
    const trimmed = value?.trim() || 'documents';
    const withoutSlashes = trimmed.replace(/^\/+|\/+$/g, '');
    return withoutSlashes.length > 0 ? `${withoutSlashes}/` : '';
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

  private requireEnv(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
      throw new Error(`Falta configurar ${name} para usar OBJECT_STORAGE.`);
    }

    return value;
  }

  private parseBoolean(value: string | undefined, fallback: boolean) {
    if (!value?.trim()) {
      return fallback;
    }

    return value.trim().toLowerCase() === 'true';
  }

  private async tryDeleteProbeObject(objectKey: string) {
    try {
      await this.getClient().send(
        new DeleteObjectCommand({
          Bucket: this.getBucket(),
          Key: objectKey,
        }),
      );
    } catch {
      // La limpieza del probe es best-effort cuando el flujo ya viene fallando.
    }
  }
}
