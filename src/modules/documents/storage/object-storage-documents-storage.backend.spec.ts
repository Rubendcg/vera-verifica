import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { DocumentStorageKind } from '../entities/documents.enums';
import { ObjectStorageDocumentsStorageBackend } from './object-storage-documents-storage.backend';

describe('ObjectStorageDocumentsStorageBackend', () => {
  const previousEnv = { ...process.env };

  beforeEach(() => {
    process.env.DOCUMENTS_S3_BUCKET = 'vera-documents';
    process.env.DOCUMENTS_S3_REGION = 'us-east-1';
    process.env.DOCUMENTS_S3_ACCESS_KEY_ID = 'test-access-key';
    process.env.DOCUMENTS_S3_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.DOCUMENTS_S3_ENDPOINT = 'http://127.0.0.1:9000';
    process.env.DOCUMENTS_S3_FORCE_PATH_STYLE = 'true';
    process.env.DOCUMENTS_S3_PREFIX = 'expedientes';
  });

  afterAll(() => {
    process.env = previousEnv;
  });

  afterEach(() => {
    process.env = { ...previousEnv };
  });

  it('uploads a pdf to a provider-neutral object key', async () => {
    const send = jest.fn().mockResolvedValue({});
    const backend = ObjectStorageDocumentsStorageBackend.forTesting({ send });
    const content = Buffer.from('%PDF-1.4\n%%EOF');

    const stored = await backend.storePdf({
      documentId: '100',
      versionNo: 2,
      originalFileName: 'tarjeta fisica.pdf',
      mimeType: 'application/pdf',
      content,
    });

    expect(stored.storageKind).toBe(DocumentStorageKind.OBJECT_STORAGE);
    expect(stored.storagePath).toMatch(
      /^expedientes\/100\/v0002-[a-f0-9-]+-tarjeta_fisica\.pdf$/,
    );
    expect(stored.fileSizeBytes).toBe(content.length);
    expect(stored.sha256Hex).toHaveLength(64);

    const command = send.mock.calls[0][0] as PutObjectCommand;
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toMatchObject({
      Bucket: 'vera-documents',
      ContentType: 'application/pdf',
      Metadata: {
        documentId: '100',
      },
    });
    expect(command.input.Key).toBe(stored.storagePath);
    expect(command.input.Body).toBe(content);
  });

  it('downloads the stored object by storagePath', async () => {
    const content = Buffer.from('%PDF-1.4\nobject\n%%EOF');
    const send = jest
      .fn()
      .mockResolvedValueOnce({
        Body: {
          transformToByteArray: jest
            .fn()
            .mockResolvedValue(Uint8Array.from(content)),
        },
      })
      .mockResolvedValueOnce({});
    const backend = ObjectStorageDocumentsStorageBackend.forTesting({ send });

    const downloaded = await backend.readFile({
      storagePath: 'expedientes/100/current.pdf',
    } as never);

    expect(downloaded.equals(content)).toBe(true);

    const getCommand = send.mock.calls[0][0] as GetObjectCommand;
    expect(getCommand).toBeInstanceOf(GetObjectCommand);
    expect(getCommand.input).toEqual({
      Bucket: 'vera-documents',
      Key: 'expedientes/100/current.pdf',
    });

    await backend.deleteFile({
      storagePath: 'expedientes/100/current.pdf',
    } as never);

    const deleteCommand = send.mock.calls[1][0] as DeleteObjectCommand;
    expect(deleteCommand).toBeInstanceOf(DeleteObjectCommand);
    expect(deleteCommand.input).toEqual({
      Bucket: 'vera-documents',
      Key: 'expedientes/100/current.pdf',
    });
  });

  it('probes object storage with put, get and delete of a temporary object', async () => {
    const payload = Buffer.from(
      JSON.stringify({
        source: 'vera-documents-probe',
        timestamp: '2026-05-13T00:00:00.000Z',
      }),
      'utf-8',
    );
    const send = jest
      .fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        Body: {
          transformToByteArray: jest
            .fn()
            .mockResolvedValue(Uint8Array.from(payload)),
        },
      })
      .mockResolvedValueOnce({});
    const backend = ObjectStorageDocumentsStorageBackend.forTesting({ send });
    jest.useFakeTimers().setSystemTime(new Date('2026-05-13T00:00:00.000Z'));

    const result = await backend.probeConnectivity();

    expect(result).toMatchObject({
      storageKind: DocumentStorageKind.OBJECT_STORAGE,
      bucket: 'vera-documents',
      endpoint: 'http://127.0.0.1:9000',
      prefix: 'expedientes/',
      uploadedBytes: payload.length,
      downloadedBytes: payload.length,
      deleted: true,
    });
    expect(result.objectKey).toMatch(
      /^expedientes\/__healthchecks__\/probe-\d+-[a-f0-9-]+\.txt$/,
    );

    expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
    expect(send.mock.calls[1][0]).toBeInstanceOf(GetObjectCommand);
    expect(send.mock.calls[2][0]).toBeInstanceOf(DeleteObjectCommand);

    jest.useRealTimers();
  });
});
