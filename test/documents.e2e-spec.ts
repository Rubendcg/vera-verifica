import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { AdminGuard } from '../src/modules/auth/guards/admin.guard';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { DocumentsController } from '../src/modules/documents/documents.controller';
import { DocumentsService } from '../src/modules/documents/documents.service';
import { DocumentFile } from '../src/modules/documents/entities/document-file.entity';
import { Document } from '../src/modules/documents/entities/document.entity';
import {
  DocumentStatus,
  DocumentStorageKind,
  DocumentType,
} from '../src/modules/documents/entities/documents.enums';
import { DocumentsStorageService } from '../src/modules/documents/storage/documents-storage.service';
import { LocalDocumentsStorageBackend } from '../src/modules/documents/storage/local-documents-storage.backend';
import { ObjectStorageDocumentsStorageBackend } from '../src/modules/documents/storage/object-storage-documents-storage.backend';
import { Party } from '../src/modules/parties/entities/party.entity';
import { User } from '../src/modules/users/entities/user.entity';
import {
  UserVehicleAccess,
  UserVehicleAccessType,
} from '../src/modules/vehicles/entities/user-vehicle-access.entity';
import { Vehicle, VehicleRegime } from '../src/modules/vehicles/entities/vehicle.entity';
import { VerificationType } from '../src/modules/verifications/entities/verifications.enums';

describe('Documents endpoints (e2e)', () => {
  let app: INestApplication;
  let storageRoot: string;
  let objectStorageContents: Map<string, Buffer>;
  let objectStorageBackend: {
    storageKind: DocumentStorageKind;
    probeConnectivity: jest.Mock;
    storePdf: jest.Mock;
    readFile: jest.Mock;
    deleteFile: jest.Mock;
  };

  let users: User[];
  let parties: Party[];
  let vehicles: Vehicle[];
  let accesses: UserVehicleAccess[];
  let documents: Document[];
  let documentFiles: DocumentFile[];

  function createUser(params: {
    id: string;
    email: string;
    fullName: string;
    isAdmin: boolean;
  }) {
    return {
      id: params.id,
      email: params.email,
      passwordHash: hashSync('Secret123!', 10),
      fullName: params.fullName,
      isAdmin: params.isAdmin,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      party: null,
      vehicleAccesses: [],
      grantedVehicleAccesses: [],
      ownerVerificationResponses: [],
      adminVerificationUpdates: [],
      verificationObligationHistoryEntries: [],
      uploadedDocuments: [],
      uploadedDocumentFiles: [],
    } as User;
  }

  function createParty() {
    return {
      id: '10',
      partyType: 'MORAL',
      rfc: 'VERA010101AAA',
      legalName: 'Transportes Vera SA de CV',
      displayName: 'Transportes Vera',
      phone: null,
      email: null,
      contacts: [],
      documents: [],
      vehicleRoles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Party;
  }

  function createVehicle(params: { id: string; plate: string }) {
    return {
      id: params.id,
      plate: params.plate,
      serialNiv: `VIN-${params.id}`,
      engineNumber: `ENGINE-${params.id}`,
      unitType: 'TRACTOCAMION',
      regime: VehicleRegime.FEDERAL,
      scheduleMarkerAuto: '5',
      scheduleMarkerOverride: null,
      scheduleMarkerEffective: '5',
      isActive: true,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [],
      userAccesses: [],
      verificationEvents: [],
      verificationObligations: [],
      documents: [],
    } as Vehicle;
  }

  function createDocument(params: {
    id: string;
    vehicle: Vehicle;
    uploadedByUser: User;
    relatedParty: Party | null;
    documentType: DocumentType;
    verificationType: VerificationType | null;
    isVisibleToOwner: boolean;
    documentNumber: string;
  }) {
    return {
      id: params.id,
      vehicle: params.vehicle,
      relatedParty: params.relatedParty,
      uploadedByUser: params.uploadedByUser,
      documentType: params.documentType,
      verificationType: params.verificationType,
      documentNumber: params.documentNumber,
      issueDate: '2026-01-10',
      validUntil: '2026-12-31',
      documentStatus: DocumentStatus.ACTIVE,
      isVisibleToOwner: params.isVisibleToOwner,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: [],
      sourceVerificationEvents: [],
    } as Document;
  }

  function createFile(params: {
    id: string;
    document: Document;
    uploadedByUser: User;
    versionNo: number;
    originalFileName: string;
    storagePath: string;
    isCurrent: boolean;
  }) {
    return {
      id: params.id,
      document: params.document,
      uploadedByUser: params.uploadedByUser,
      versionNo: params.versionNo,
      mimeType: 'application/pdf',
      originalFileName: params.originalFileName,
      storageKind: DocumentStorageKind.LOCAL_PATH,
      storagePath: params.storagePath,
      contentBytea: null,
      fileSizeBytes: '2048',
      sha256Hex: 'a'.repeat(64),
      pageCount: 2,
      scannedAt: null,
      ocrStatus: 'NOT_REQUESTED' as never,
      ocrText: null,
      isCurrent: params.isCurrent,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DocumentFile;
  }

  function buildState() {
    users = [
      createUser({
        id: '1',
        email: 'admin@vera.local',
        fullName: 'Admin Vera',
        isAdmin: true,
      }),
      createUser({
        id: '2',
        email: 'owner@vera.local',
        fullName: 'Owner Vera',
        isAdmin: false,
      }),
      createUser({
        id: '3',
        email: 'outside@vera.local',
        fullName: 'Outside Vera',
        isAdmin: false,
      }),
    ];

    parties = [createParty()];
    vehicles = [
      createVehicle({ id: '1', plate: '55AB5C' }),
      createVehicle({ id: '2', plate: '77CD8E' }),
    ];

    accesses = [
      {
        id: '300',
        user: users[1],
        vehicle: vehicles[0],
        accessType: UserVehicleAccessType.OWNER_PORTAL,
        isActive: true,
        grantedByUser: users[0],
        grantedAt: new Date('2026-01-01T10:00:00.000Z'),
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserVehicleAccess,
    ];

    documents = [
      createDocument({
        id: '100',
        vehicle: vehicles[0],
        uploadedByUser: users[0],
        relatedParty: parties[0],
        documentType: DocumentType.TARJETA_CIRCULACION,
        verificationType: null,
        isVisibleToOwner: true,
        documentNumber: 'TC-100',
      }),
      createDocument({
        id: '101',
        vehicle: vehicles[0],
        uploadedByUser: users[0],
        relatedParty: parties[0],
        documentType: DocumentType.CONSTANCIA_EMISIONES,
        verificationType: VerificationType.EMISSIONS,
        isVisibleToOwner: false,
        documentNumber: 'EM-101',
      }),
      createDocument({
        id: '102',
        vehicle: vehicles[1],
        uploadedByUser: users[0],
        relatedParty: parties[0],
        documentType: DocumentType.PERMISO,
        verificationType: null,
        isVisibleToOwner: true,
        documentNumber: 'PER-102',
      }),
    ];

    documentFiles = [
      createFile({
        id: '200',
        document: documents[0],
        uploadedByUser: users[0],
        versionNo: 1,
        originalFileName: 'tarjeta.pdf',
        storagePath: 'docs/tarjeta-v1.pdf',
        isCurrent: true,
      }),
      createFile({
        id: '201',
        document: documents[1],
        uploadedByUser: users[0],
        versionNo: 1,
        originalFileName: 'emisiones.pdf',
        storagePath: 'docs/emisiones-v1.pdf',
        isCurrent: true,
      }),
      createFile({
        id: '202',
        document: documents[2],
        uploadedByUser: users[0],
        versionNo: 1,
        originalFileName: 'permiso.pdf',
        storagePath: 'docs/permiso-v1.pdf',
        isCurrent: true,
      }),
    ];

    for (const document of documents) {
      document.files = documentFiles
        .filter((file) => file.document.id === document.id)
        .sort((left, right) => right.versionNo - left.versionNo);
      document.vehicle.documents.push(document);
      document.relatedParty?.documents.push(document);
      document.uploadedByUser.uploadedDocuments.push(document);
    }
  }

  beforeEach(async () => {
    buildState();
    objectStorageContents = new Map<string, Buffer>();
    objectStorageBackend = {
      storageKind: DocumentStorageKind.OBJECT_STORAGE,
      probeConnectivity: jest.fn(async () => ({
        storageKind: DocumentStorageKind.OBJECT_STORAGE,
        bucket: 'vera-documents',
        endpoint: 'http://127.0.0.1:9000',
        prefix: 'documents/',
        objectKey: 'documents/__healthchecks__/probe-test.txt',
        uploadedBytes: 64,
        downloadedBytes: 64,
        deleted: true,
      })),
      storePdf: jest.fn(
        async (input: {
          documentId: string;
          versionNo: number;
          originalFileName: string;
          mimeType: string;
          content: Buffer;
        }) => {
          const storagePath = `documents/${input.documentId}/v${String(input.versionNo).padStart(4, '0')}-${input.originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          objectStorageContents.set(storagePath, input.content);
          return {
            storageKind: DocumentStorageKind.OBJECT_STORAGE,
            storagePath,
            fileSizeBytes: input.content.length,
            sha256Hex: 'b'.repeat(64),
          };
        },
      ),
      readFile: jest.fn(async (file: { storagePath: string }) => {
        const content = objectStorageContents.get(file.storagePath);
        if (!content) {
          throw new Error('Missing object storage content in test backend.');
        }

        return content;
      }),
      deleteFile: jest.fn(async (file: { storagePath: string }) => {
        objectStorageContents.delete(file.storagePath);
      }),
    };
    storageRoot = join(
      process.cwd(),
      '.codex-tmp',
      `documents-e2e-${Date.now()}-${Math.round(Math.random() * 100000)}`,
    );
    process.env.DOCUMENTS_STORAGE_DRIVER = DocumentStorageKind.LOCAL_PATH;
    process.env.DOCUMENTS_STORAGE_ROOT = storageRoot;

    const userRepository = {
      findOne: jest.fn(
        async (options: { where?: { email?: string; id?: string; isActive?: boolean } }) => {
          const email = options.where?.email;
          const id = options.where?.id;
          const isActive = options.where?.isActive;

          return (
            users.find((user) => {
              if (email && user.email !== email) {
                return false;
              }

              if (id && user.id !== id) {
                return false;
              }

              if (isActive !== undefined && user.isActive !== isActive) {
                return false;
              }

              return true;
            }) ?? null
          );
        },
      ),
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return users.find((user) => user.id === where.id) ?? null;
      }),
      save: jest.fn(async (user: User) => user),
    };

    const partyRepository = {
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return parties.find((party) => party.id === where.id) ?? null;
      }),
    };

    const vehicleRepository = {
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return vehicles.find((vehicle) => vehicle.id === where.id) ?? null;
      }),
    };

    const userVehicleAccessRepository = {
      find: jest.fn(
        async (options: { where?: { user?: { id?: string }; isActive?: boolean } }) => {
          return accesses.filter(
            (access) =>
              access.user.id === options.where?.user?.id &&
              access.isActive === options.where?.isActive,
          );
        },
      ),
      count: jest.fn(
        async (options: {
          where?: { user?: { id?: string }; vehicle?: { id?: string }; isActive?: boolean };
        }) => {
          return accesses.filter(
            (access) =>
              access.user.id === options.where?.user?.id &&
              access.vehicle.id === options.where?.vehicle?.id &&
              access.isActive === options.where?.isActive,
          ).length;
        },
      ),
    };

    const documentRepository = {
      find: jest.fn(async (options?: { where?: { id?: string } }) => {
        const documentId = options?.where?.id;
        if (!documentId) {
          return documents;
        }

        return documents.filter((document) => document.id === documentId);
      }),
      findOne: jest.fn(async (options: { where?: { id?: string } }) => {
        return documents.find((document) => document.id === options.where?.id) ?? null;
      }),
      create: jest.fn((payload: Partial<Document>) => {
        return {
          id: `${100 + documents.length}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          files: [],
          sourceVerificationEvents: [],
          ...payload,
        } as Document;
      }),
      save: jest.fn(async (document: Document) => {
        const existing = documents.find((item) => item.id === document.id);
        if (existing) {
          Object.assign(existing, document, { updatedAt: new Date() });
          return existing;
        }

        documents.push(document);
        document.vehicle.documents.push(document);
        document.relatedParty?.documents.push(document);
        document.uploadedByUser?.uploadedDocuments.push(document);
        return document;
      }),
      manager: {
        transaction: async (
          callback: (manager: {
            getRepository: (entity: unknown) => unknown;
          }) => Promise<unknown>,
        ) =>
          callback({
            getRepository: (entity: unknown) => {
              if (entity === Document) {
                return documentRepository;
              }

              if (entity === DocumentFile) {
                return documentFileRepository;
              }

              throw new Error('Unexpected repository requested in documents test.');
            },
          }),
      },
    };

    const documentFileRepository = {
      create: jest.fn((payload: Partial<DocumentFile>) => {
        return {
          id: `${200 + documentFiles.length}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...payload,
        } as DocumentFile;
      }),
      save: jest.fn(async (file: DocumentFile | DocumentFile[]) => {
        if (Array.isArray(file)) {
          for (const item of file) {
            await documentFileRepository.save(item);
          }

          return file;
        }

        const existing = documentFiles.find((item) => item.id === file.id);
        if (existing) {
          Object.assign(existing, file, { updatedAt: new Date() });
          return existing;
        }

        documentFiles.push(file);
        file.document.files = [file, ...file.document.files].sort(
          (left, right) => right.versionNo - left.versionNo,
        );
        file.uploadedByUser?.uploadedDocumentFiles.push(file);
        return file;
      }),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController, DocumentsController],
      providers: [
        AuthService,
        DocumentsService,
        DocumentsStorageService,
        LocalDocumentsStorageBackend,
        JwtAuthGuard,
        AdminGuard,
        {
          provide: ObjectStorageDocumentsStorageBackend,
          useValue: objectStorageBackend,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(Party),
          useValue: partyRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: vehicleRepository,
        },
        {
          provide: getRepositoryToken(UserVehicleAccess),
          useValue: userVehicleAccessRepository,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: documentRepository,
        },
        {
          provide: getRepositoryToken(DocumentFile),
          useValue: documentFileRepository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    delete process.env.DOCUMENTS_STORAGE_DRIVER;
    delete process.env.DOCUMENTS_STORAGE_ROOT;
    if (existsSync(storageRoot)) {
      rmSync(storageRoot, { recursive: true, force: true });
    }
  });

  async function login(email: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'Secret123!',
      })
      .expect(201);

    return response.body.accessToken as string;
  }

  it('rejects documents routes without a bearer token', async () => {
    await request(app.getHttpServer()).get('/documents').expect(401);
  });

  it('shows only owner-visible documents for assigned vehicles', async () => {
    const token = await login('owner@vera.local');

    const response = await request(app.getHttpServer())
      .get('/documents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.total).toBe(1);
    expect(response.body.items[0]).toMatchObject({
      id: '100',
      documentType: DocumentType.TARJETA_CIRCULACION,
      currentFile: {
        versionNo: 1,
      },
    });
    expect(response.body.items[0].files).toBeUndefined();
  });

  it('blocks an owner from reading a hidden document', async () => {
    const token = await login('owner@vera.local');

    await request(app.getHttpServer())
      .get('/documents/101')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('allows an admin to probe object storage connectivity', async () => {
    const token = await login('admin@vera.local');

    const response = await request(app.getHttpServer())
      .post('/documents/storage/object/probe')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body).toMatchObject({
      storageKind: DocumentStorageKind.OBJECT_STORAGE,
      bucket: 'vera-documents',
      deleted: true,
    });
    expect(objectStorageBackend.probeConnectivity).toHaveBeenCalledTimes(1);
  });

  it('blocks a non-admin from probing object storage connectivity', async () => {
    const token = await login('owner@vera.local');

    await request(app.getHttpServer())
      .post('/documents/storage/object/probe')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('allows an admin to migrate a current local pdf to object storage', async () => {
    const adminToken = await login('admin@vera.local');
    const ownerToken = await login('owner@vera.local');
    const pdfContent = Buffer.from('%PDF-1.4\nmigrated\n%%EOF');

    await request(app.getHttpServer())
      .post('/documents/100/files/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', pdfContent, {
        filename: 'tarjeta-para-migrar.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    const migrateResponse = await request(app.getHttpServer())
      .post('/documents/storage/object/migrate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        documentId: '100',
        onlyCurrent: true,
      })
      .expect(201);

    expect(migrateResponse.body).toMatchObject({
      mode: 'EXECUTE',
      selectedFilesCount: 2,
      eligibleFilesCount: 1,
      processedFilesCount: 1,
      migratedCount: 1,
      failedCount: 0,
    });
    expect(migrateResponse.body.items[0]).toMatchObject({
      documentId: '100',
      versionNo: 2,
      status: 'MIGRATED',
      toStorageKind: DocumentStorageKind.OBJECT_STORAGE,
    });

    const detailResponse = await request(app.getHttpServer())
      .get('/documents/100')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(detailResponse.body.currentFile).toMatchObject({
      versionNo: 2,
      storageKind: DocumentStorageKind.OBJECT_STORAGE,
    });

    const downloadResponse = await request(app.getHttpServer())
      .get('/documents/100/files/current/download')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(downloadResponse.headers['content-type']).toContain('application/pdf');
    expect(Buffer.compare(downloadResponse.body, pdfContent)).toBe(0);
    expect(objectStorageBackend.storePdf).toHaveBeenCalledTimes(1);
    expect(objectStorageBackend.readFile).toHaveBeenCalledTimes(1);
  });

  it('blocks a non-admin from triggering storage migration', async () => {
    const token = await login('owner@vera.local');

    await request(app.getHttpServer())
      .post('/documents/storage/object/migrate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        documentId: '100',
        onlyCurrent: true,
      })
      .expect(403);
  });

  it('allows an admin to create a document', async () => {
    const token = await login('admin@vera.local');

    const response = await request(app.getHttpServer())
      .post('/documents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId: '1',
        relatedPartyId: '10',
        documentType: DocumentType.CONSTANCIA_FISICO_MECANICA,
        verificationType: VerificationType.PHYSICAL_MECHANICAL,
        documentNumber: 'FM-500',
        issueDate: '2026-05-13',
        validUntil: '2027-05-13',
        isVisibleToOwner: true,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      documentType: DocumentType.CONSTANCIA_FISICO_MECANICA,
      verificationType: VerificationType.PHYSICAL_MECHANICAL,
      vehicle: {
        id: '1',
      },
      relatedParty: {
        id: '10',
      },
    });
  });

  it('keeps a single current version when an admin uploads a new PDF version', async () => {
    const token = await login('admin@vera.local');

    const response = await request(app.getHttpServer())
      .post('/documents/100/files')
      .set('Authorization', `Bearer ${token}`)
      .send({
        mimeType: 'application/pdf',
        originalFileName: 'tarjeta-v2.pdf',
        storageKind: DocumentStorageKind.LOCAL_PATH,
        storagePath: 'docs/tarjeta-v2.pdf',
        fileSizeBytes: 4096,
        pageCount: 3,
      })
      .expect(201);

    expect(response.body.currentFile).toMatchObject({
      versionNo: 2,
      originalFileName: 'tarjeta-v2.pdf',
      isCurrent: true,
    });
    expect(response.body.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          versionNo: 2,
          isCurrent: true,
        }),
        expect.objectContaining({
          versionNo: 1,
          isCurrent: false,
        }),
      ]),
    );
  });

  it('stores a physical PDF upload and allows the assigned owner to download the current file', async () => {
    const adminToken = await login('admin@vera.local');
    const ownerToken = await login('owner@vera.local');
    const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

    const uploadResponse = await request(app.getHttpServer())
      .post('/documents/100/files/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', pdfContent, {
        filename: 'tarjeta-fisica.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    expect(uploadResponse.body.currentFile).toMatchObject({
      versionNo: 2,
      originalFileName: 'tarjeta-fisica.pdf',
      storageKind: DocumentStorageKind.LOCAL_PATH,
      isCurrent: true,
    });

    const downloadResponse = await request(app.getHttpServer())
      .get('/documents/100/files/current/download')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(downloadResponse.headers['content-type']).toContain('application/pdf');
    expect(downloadResponse.headers['content-disposition']).toContain(
      'tarjeta-fisica.pdf',
    );
    expect(Buffer.compare(downloadResponse.body, pdfContent)).toBe(0);
  });

  it('blocks an owner from downloading the current file of a hidden document', async () => {
    const token = await login('owner@vera.local');

    await request(app.getHttpServer())
      .get('/documents/101/files/current/download')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
