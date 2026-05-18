import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleSummary } from '../../common/module-summary.interface';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Party } from '../parties/entities/party.entity';
import { User } from '../users/entities/user.entity';
import { UserVehicleAccess } from '../vehicles/entities/user-vehicle-access.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VerificationType } from '../verifications/entities/verifications.enums';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentFileDto } from './dto/create-document-file.dto';
import { MigrateDocumentStorageDto } from './dto/migrate-document-storage.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { DocumentFile } from './entities/document-file.entity';
import { Document } from './entities/document.entity';
import {
  DocumentOcrStatus,
  DocumentStatus,
  DocumentStorageKind,
  DocumentType,
} from './entities/documents.enums';
import { DocumentsStorageService } from './storage/documents-storage.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Party)
    private readonly partyRepository: Repository<Party>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(UserVehicleAccess)
    private readonly userVehicleAccessRepository: Repository<UserVehicleAccess>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentFile)
    private readonly documentFileRepository: Repository<DocumentFile>,
    private readonly documentsStorageService: DocumentsStorageService,
  ) {}

  getModuleSummary(): ModuleSummary {
    return {
      key: 'documents',
      route: '/documents',
      phase: 3,
      purpose: 'Administra tarjetas, constancias y archivos PDF asociados al expediente vehicular.',
      tables: ['documents', 'document_files'],
    };
  }

  getCatalogs() {
    return {
      documentTypes: Object.values(DocumentType),
      documentStatuses: Object.values(DocumentStatus),
      documentStorageKinds: Object.values(DocumentStorageKind),
      documentOcrStatuses: Object.values(DocumentOcrStatus),
      verificationTypes: Object.values(VerificationType),
    };
  }

  async probeObjectStorage() {
    return this.documentsStorageService.probeObjectStorageConnectivity();
  }

  async migrateLocalFilesToObjectStorage(dto: MigrateDocumentStorageDto) {
    const documentId = dto.documentId
      ? this.normalizeId(dto.documentId, 'documentId')
      : null;
    const fileId = dto.fileId ? this.normalizeId(dto.fileId, 'fileId') : null;
    const onlyCurrent = dto.onlyCurrent ?? true;
    const deleteSourceAfterMigration = dto.deleteSourceAfterMigration ?? false;
    const dryRun = dto.dryRun ?? false;
    const limit = dto.limit ?? null;

    const documents = await this.documentRepository.find({
      where: documentId ? { id: documentId } : undefined,
      relations: {
        vehicle: true,
        files: {
          uploadedByUser: true,
        },
      },
      order: {
        id: 'ASC',
        files: {
          versionNo: 'DESC',
        },
      },
    });

    if (documentId && documents.length === 0) {
      throw new NotFoundException('No se encontro el documento indicado para migracion.');
    }

    let entries = documents.flatMap((document) =>
      (document.files ?? []).map((file) => ({
        document,
        file,
      })),
    );

    if (fileId) {
      entries = entries.filter((entry) => entry.file.id === fileId);
      if (entries.length === 0) {
        throw new NotFoundException(
          'No se encontro el archivo documental indicado para migracion.',
        );
      }
    }

    const eligibleEntries = entries.filter(
      ({ file }) =>
        (!onlyCurrent || file.isCurrent) &&
        file.mimeType === 'application/pdf' &&
        file.storageKind === DocumentStorageKind.LOCAL_PATH,
    );
    const limitedEntries = limit ? eligibleEntries.slice(0, limit) : eligibleEntries;

    const items: Array<Record<string, unknown>> = [];
    let migratedCount = 0;
    let failedCount = 0;

    for (const { document, file } of limitedEntries) {
      const baseResult = {
        documentId: document.id,
        fileId: file.id,
        versionNo: file.versionNo,
        isCurrent: file.isCurrent,
        mimeType: file.mimeType,
        originalFileName: file.originalFileName,
        fromStorageKind: file.storageKind,
        fromStoragePath: file.storagePath,
      };

      if (dryRun) {
        items.push({
          ...baseResult,
          status: 'PLANNED',
          toStorageKind: DocumentStorageKind.OBJECT_STORAGE,
        });
        continue;
      }

      try {
        const sourceFile = {
          storageKind: file.storageKind,
          storagePath: file.storagePath,
        };
        const content = await this.documentsStorageService.readFile(file);
        const storedFile = await this.documentsStorageService.storePdfInObjectStorage({
          documentId: document.id,
          versionNo: file.versionNo,
          originalFileName: file.originalFileName,
          mimeType: file.mimeType,
          content,
        });

        try {
          file.storageKind = storedFile.storageKind;
          file.storagePath = storedFile.storagePath;
          file.contentBytea = null;
          file.fileSizeBytes = `${storedFile.fileSizeBytes}`;
          file.sha256Hex = storedFile.sha256Hex;
          await this.documentFileRepository.save(file);
        } catch (error) {
          await this.documentsStorageService.deleteStoredFile({
            storageKind: storedFile.storageKind,
            storagePath: storedFile.storagePath,
          });
          throw error;
        }

        let sourceDeleted = false;
        let warning: string | null = null;

        if (deleteSourceAfterMigration) {
          try {
            await this.documentsStorageService.deleteStoredFile(sourceFile);
            sourceDeleted = true;
          } catch (error) {
            warning =
              'El archivo origen LOCAL_PATH no pudo borrarse despues de migrar.';
          }
        }

        items.push({
          ...baseResult,
          status: 'MIGRATED',
          toStorageKind: storedFile.storageKind,
          toStoragePath: storedFile.storagePath,
          sourceDeleted,
          warning,
        });
        migratedCount += 1;
      } catch (error) {
        items.push({
          ...baseResult,
          status: 'FAILED',
          error: this.describeOperationalError(error),
        });
        failedCount += 1;
      }
    }

    return {
      mode: dryRun ? 'DRY_RUN' : 'EXECUTE',
      filters: {
        documentId,
        fileId,
        onlyCurrent,
        deleteSourceAfterMigration,
        dryRun,
        limit,
      },
      selectedFilesCount: entries.length,
      eligibleFilesCount: eligibleEntries.length,
      processedFilesCount: limitedEntries.length,
      migratedCount,
      plannedCount: dryRun ? limitedEntries.length : 0,
      failedCount,
      skippedCount: entries.length - limitedEntries.length,
      items,
    };
  }

  async listDocuments(query: QueryDocumentsDto, currentUser: AuthenticatedUser) {
    const documents = await this.documentRepository.find({
      relations: {
        vehicle: true,
        relatedParty: true,
        uploadedByUser: true,
        files: {
          uploadedByUser: true,
        },
      },
      order: {
        createdAt: 'DESC',
        files: {
          versionNo: 'DESC',
        },
      },
    });

    const accessibleVehicleIds = await this.getAccessibleVehicleIds(currentUser);
    const filtered = documents.filter((document) =>
      this.matchesDocumentQuery(document, query, currentUser, accessibleVehicleIds),
    );

    return {
      total: filtered.length,
      items: filtered.map((document) =>
        this.mapDocument(document, {
          includeAllFiles: false,
          ownerMode: !currentUser.isAdmin,
        }),
      ),
    };
  }

  async getDocumentById(id: string, currentUser: AuthenticatedUser) {
    const document = await this.documentRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        relatedParty: true,
        uploadedByUser: true,
        files: {
          uploadedByUser: true,
        },
      },
      order: {
        files: {
          versionNo: 'DESC',
        },
      },
    });

    if (!document) {
      throw new NotFoundException('No se encontro el documento solicitado.');
    }

    await this.assertDocumentAccess(currentUser, document);

    return this.mapDocument(document, {
      includeAllFiles: currentUser.isAdmin,
      ownerMode: !currentUser.isAdmin,
    });
  }

  async createDocument(dto: CreateDocumentDto, currentUser: AuthenticatedUser) {
    const vehicle = await this.findVehicleOrFail(dto.vehicleId, 'vehicleId');
    const relatedParty = dto.relatedPartyId
      ? await this.findPartyOrFail(dto.relatedPartyId, 'relatedPartyId')
      : null;
    const uploadedByUser = await this.findUserOrFail(currentUser.id, 'currentUserId');
    const documentType = this.ensureEnumValue(dto.documentType, DocumentType, 'documentType');
    const verificationType = dto.verificationType
      ? this.ensureEnumValue(dto.verificationType, VerificationType, 'verificationType')
      : null;

    this.assertDocumentTypeCompatibility(documentType, verificationType);

    const issueDate = dto.issueDate
      ? this.parseDateOnly(dto.issueDate, 'issueDate')
      : null;
    const validUntil = dto.validUntil
      ? this.parseDateOnly(dto.validUntil, 'validUntil')
      : null;

    if (issueDate && validUntil && this.compareDateLike(issueDate, validUntil) > 0) {
      throw new BadRequestException(
        'La fecha de emision no puede ser posterior a la fecha de vigencia.',
      );
    }

    const document = this.documentRepository.create({
      vehicle,
      relatedParty,
      uploadedByUser,
      documentType,
      verificationType,
      documentNumber: this.optionalText(dto.documentNumber),
      issueDate,
      validUntil,
      documentStatus: dto.documentStatus ?? DocumentStatus.ACTIVE,
      isVisibleToOwner: dto.isVisibleToOwner ?? false,
      notes: this.optionalText(dto.notes),
    });

    const saved = await this.documentRepository.save(document);

    return this.getDocumentById(saved.id, currentUser);
  }

  async addDocumentFileVersion(
    id: string,
    dto: CreateDocumentFileDto,
    currentUser: AuthenticatedUser,
  ) {
    const documentId = this.normalizeId(id, 'id');
    const uploadedByUser = await this.findUserOrFail(currentUser.id, 'currentUserId');
    const storageKind = dto.storageKind ?? DocumentStorageKind.LOCAL_PATH;
    const mimeType = this.requireText(dto.mimeType, 'mimeType').toLowerCase();

    if (mimeType !== 'application/pdf') {
      throw new BadRequestException('Solo se permite cargar documentos PDF.');
    }

    const contentBytea = dto.contentBase64
      ? this.parseBase64(dto.contentBase64, 'contentBase64')
      : null;

    this.assertDocumentStorageRequirements(storageKind, dto.storagePath, contentBytea);

    return this.persistDocumentFileVersion(
      documentId,
      {
        uploadedByUser,
        mimeType,
        originalFileName: this.requireText(dto.originalFileName, 'originalFileName'),
        storageKind,
        storagePath: this.optionalText(dto.storagePath),
        contentBytea,
        fileSizeBytes:
          dto.fileSizeBytes !== undefined && dto.fileSizeBytes !== null
            ? dto.fileSizeBytes
            : null,
        sha256Hex: dto.sha256Hex?.toLowerCase() ?? null,
        pageCount: dto.pageCount ?? null,
        scannedAt: dto.scannedAt ? this.parseDateTime(dto.scannedAt, 'scannedAt') : null,
        ocrStatus: dto.ocrStatus ?? DocumentOcrStatus.NOT_REQUESTED,
        ocrText: this.optionalText(dto.ocrText),
      },
      {
        includeAllFiles: true,
        ownerMode: false,
      },
    );
  }

  async uploadDocumentPdf(
    id: string,
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
    currentUser: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo PDF en el campo file.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Solo se permite cargar documentos PDF.');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('El archivo PDF recibido esta vacio.');
    }

    const document = await this.documentRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        files: true,
      },
      order: {
        files: {
          versionNo: 'DESC',
        },
      },
    });

    if (!document) {
      throw new NotFoundException('No se encontro el documento solicitado.');
    }

    const uploadedByUser = await this.findUserOrFail(currentUser.id, 'currentUserId');
    const nextVersionNo =
      document.files.reduce((highest, current) => Math.max(highest, current.versionNo), 0) + 1;
    const storedFile = await this.documentsStorageService.storePdf({
      documentId: document.id,
      versionNo: nextVersionNo,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer,
    });

    try {
      return await this.persistDocumentFileVersion(
        document.id,
        {
          uploadedByUser,
          mimeType: file.mimetype,
          originalFileName: file.originalname,
          storageKind: storedFile.storageKind,
          storagePath: storedFile.storagePath,
          contentBytea: null,
          fileSizeBytes: storedFile.fileSizeBytes,
          sha256Hex: storedFile.sha256Hex,
          pageCount: null,
          scannedAt: null,
          ocrStatus: DocumentOcrStatus.NOT_REQUESTED,
          ocrText: null,
        },
        {
          includeAllFiles: true,
          ownerMode: false,
        },
      );
    } catch (error) {
      await this.documentsStorageService.deleteStoredFile({
        storageKind: storedFile.storageKind,
        storagePath: storedFile.storagePath,
      });
      throw error;
    }
  }

  async downloadCurrentDocumentFile(id: string, currentUser: AuthenticatedUser) {
    const document = await this.documentRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        relatedParty: true,
        uploadedByUser: true,
        files: {
          uploadedByUser: true,
        },
      },
      order: {
        files: {
          versionNo: 'DESC',
        },
      },
    });

    if (!document) {
      throw new NotFoundException('No se encontro el documento solicitado.');
    }

    await this.assertDocumentAccess(currentUser, document);

    const currentFile = this.getCurrentFile(document);
    if (!currentFile) {
      throw new NotFoundException('El documento no tiene una version PDF vigente.');
    }

    if (currentFile.mimeType !== 'application/pdf') {
      throw new BadRequestException('La version vigente del documento no es un PDF descargable.');
    }

    if (currentFile.storageKind === DocumentStorageKind.DATABASE) {
      if (!currentFile.contentBytea) {
        throw new NotFoundException('No se encontro el contenido PDF almacenado en base de datos.');
      }

      return {
        content: currentFile.contentBytea,
        mimeType: currentFile.mimeType,
        fileName: currentFile.originalFileName,
      };
    }

    const content = await this.documentsStorageService.readFile(currentFile);

    return {
      content,
      mimeType: currentFile.mimeType,
      fileName: currentFile.originalFileName,
    };
  }

  private async persistDocumentFileVersion(
    documentId: string,
    payload: {
      uploadedByUser: User;
      mimeType: string;
      originalFileName: string;
      storageKind: DocumentStorageKind;
      storagePath: string | null;
      contentBytea: Buffer | null;
      fileSizeBytes: number | null;
      sha256Hex: string | null;
      pageCount: number | null;
      scannedAt: Date | null;
      ocrStatus: DocumentOcrStatus;
      ocrText: string | null;
    },
    options: { includeAllFiles: boolean; ownerMode: boolean },
  ) {
    return this.documentRepository.manager.transaction(async (manager) => {
      const documentRepository = manager.getRepository(Document);
      const documentFileRepository = manager.getRepository(DocumentFile);

      const document = await documentRepository.findOne({
        where: { id: documentId },
        relations: {
          vehicle: true,
          relatedParty: true,
          uploadedByUser: true,
          files: {
            uploadedByUser: true,
          },
        },
        order: {
          files: {
            versionNo: 'DESC',
          },
        },
      });

      if (!document) {
        throw new NotFoundException('No se encontro el documento solicitado.');
      }

      for (const currentFile of document.files.filter((file) => file.isCurrent)) {
        currentFile.isCurrent = false;
        await documentFileRepository.save(currentFile);
      }

      const nextVersionNo =
        document.files.reduce((highest, file) => Math.max(highest, file.versionNo), 0) + 1;

      const documentFile = documentFileRepository.create({
        document,
        uploadedByUser: payload.uploadedByUser,
        versionNo: nextVersionNo,
        mimeType: payload.mimeType,
        originalFileName: payload.originalFileName,
        storageKind: payload.storageKind,
        storagePath: payload.storagePath,
        contentBytea: payload.contentBytea,
        fileSizeBytes:
          payload.fileSizeBytes !== undefined &&
          payload.fileSizeBytes !== null
            ? `${payload.fileSizeBytes}`
            : null,
        sha256Hex: payload.sha256Hex,
        pageCount: payload.pageCount,
        scannedAt: payload.scannedAt,
        ocrStatus: payload.ocrStatus,
        ocrText: payload.ocrText,
        isCurrent: true,
      });

      await documentFileRepository.save(documentFile);

      const savedDocument = await documentRepository.findOne({
        where: { id: documentId },
        relations: {
          vehicle: true,
          relatedParty: true,
          uploadedByUser: true,
          files: {
            uploadedByUser: true,
          },
        },
        order: {
          files: {
            versionNo: 'DESC',
          },
        },
      });

      if (!savedDocument) {
        throw new NotFoundException(
          'No fue posible recuperar el documento despues de agregar la version.',
        );
      }

      return this.mapDocument(savedDocument, options);
    });
  }

  private matchesDocumentQuery(
    document: Document,
    query: QueryDocumentsDto,
    currentUser: AuthenticatedUser,
    accessibleVehicleIds: Set<string> | null,
  ) {
    if (!currentUser.isAdmin) {
      if (!accessibleVehicleIds?.has(document.vehicle.id)) {
        return false;
      }

      if (!document.isVisibleToOwner) {
        return false;
      }
    }

    if (query.vehicleId && document.vehicle.id !== this.normalizeId(query.vehicleId, 'vehicleId')) {
      return false;
    }

    if (query.documentType && document.documentType !== query.documentType) {
      return false;
    }

    if (
      query.verificationType &&
      document.verificationType !== query.verificationType
    ) {
      return false;
    }

    if (query.documentStatus && document.documentStatus !== query.documentStatus) {
      return false;
    }

    if (
      query.isVisibleToOwner !== undefined &&
      document.isVisibleToOwner !== query.isVisibleToOwner
    ) {
      return false;
    }

    const currentFile = this.getCurrentFile(document);

    if (query.onlyWithCurrentFile && !currentFile) {
      return false;
    }

    if (query.search) {
      const search = query.search.trim().toLowerCase();
      const haystacks = [
        document.vehicle.plate,
        document.documentNumber,
        document.relatedParty?.displayName,
        document.relatedParty?.legalName,
        currentFile?.originalFileName,
      ]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase());

      if (!haystacks.some((value) => value.includes(search))) {
        return false;
      }
    }

    return true;
  }

  private mapDocument(
    document: Document,
    options: { includeAllFiles: boolean; ownerMode: boolean },
  ) {
    const files = [...(document.files ?? [])].sort(
      (left, right) => right.versionNo - left.versionNo,
    );
    const currentFile = files.find((file) => file.isCurrent) ?? null;

    return {
      id: document.id,
      documentType: document.documentType,
      verificationType: document.verificationType,
      documentNumber: document.documentNumber,
      issueDate: document.issueDate,
      validUntil: document.validUntil,
      documentStatus: document.documentStatus,
      isVisibleToOwner: document.isVisibleToOwner,
      notes: document.notes,
      vehicle: {
        id: document.vehicle.id,
        plate: document.vehicle.plate,
        regime: document.vehicle.regime,
        unitType: document.vehicle.unitType,
      },
      relatedParty: document.relatedParty
        ? {
            id: document.relatedParty.id,
            partyType: document.relatedParty.partyType,
            legalName: document.relatedParty.legalName,
            displayName: document.relatedParty.displayName,
          }
        : null,
      uploadedByUser: document.uploadedByUser
        ? this.mapUserSummary(document.uploadedByUser)
        : null,
      currentFile: currentFile ? this.mapDocumentFile(currentFile, options.ownerMode) : null,
      files: options.includeAllFiles
        ? files.map((file) => this.mapDocumentFile(file, options.ownerMode))
        : undefined,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  private mapDocumentFile(file: DocumentFile, ownerMode: boolean) {
    return {
      id: file.id,
      versionNo: file.versionNo,
      mimeType: file.mimeType,
      originalFileName: file.originalFileName,
      storageKind: file.storageKind,
      storagePath: ownerMode ? null : file.storagePath,
      fileSizeBytes: file.fileSizeBytes,
      sha256Hex: ownerMode ? null : file.sha256Hex,
      pageCount: file.pageCount,
      scannedAt: file.scannedAt,
      ocrStatus: file.ocrStatus,
      ocrText: ownerMode ? null : file.ocrText,
      isCurrent: file.isCurrent,
      uploadedByUser: file.uploadedByUser
        ? this.mapUserSummary(file.uploadedByUser)
        : null,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  private mapUserSummary(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };
  }

  private getCurrentFile(document: Document) {
    return document.files?.find((file) => file.isCurrent) ?? null;
  }

  private async assertDocumentAccess(currentUser: AuthenticatedUser, document: Document) {
    if (!currentUser.isAdmin && !document.isVisibleToOwner) {
      throw new ForbiddenException(
        'El documento solicitado no esta disponible para el propietario.',
      );
    }

    await this.assertVehicleAccess(currentUser, document.vehicle.id);
  }

  private async getAccessibleVehicleIds(currentUser: AuthenticatedUser) {
    if (currentUser.isAdmin) {
      return null;
    }

    const accesses = await this.userVehicleAccessRepository.find({
      where: {
        user: { id: currentUser.id },
        isActive: true,
      },
      relations: {
        vehicle: true,
      },
    });

    return new Set(accesses.map((access) => access.vehicle.id));
  }

  private async assertVehicleAccess(currentUser: AuthenticatedUser, vehicleId: string) {
    if (currentUser.isAdmin) {
      return;
    }

    const activeAccessCount = await this.userVehicleAccessRepository.count({
      where: {
        user: { id: currentUser.id },
        vehicle: { id: vehicleId },
        isActive: true,
      },
    });

    if (activeAccessCount === 0) {
      throw new ForbiddenException(
        'El usuario autenticado no tiene acceso al vehiculo solicitado.',
      );
    }
  }

  private assertDocumentTypeCompatibility(
    documentType: DocumentType,
    verificationType: VerificationType | null,
  ) {
    if (documentType === DocumentType.CONSTANCIA_FISICO_MECANICA) {
      if (verificationType !== VerificationType.PHYSICAL_MECHANICAL) {
        throw new BadRequestException(
          'La constancia fisico-mecanica debe usar verificationType PHYSICAL_MECHANICAL.',
        );
      }

      return;
    }

    if (documentType === DocumentType.CONSTANCIA_EMISIONES) {
      if (verificationType !== VerificationType.EMISSIONS) {
        throw new BadRequestException(
          'La constancia de emisiones debe usar verificationType EMISSIONS.',
        );
      }

      return;
    }

    if (
      verificationType &&
      [
        DocumentType.TARJETA_CIRCULACION,
        DocumentType.PERMISO,
        DocumentType.CONTRATO_ARRENDAMIENTO,
      ].includes(documentType)
    ) {
      throw new BadRequestException(
        'El tipo documental indicado no debe vincularse con verificationType.',
      );
    }
  }

  private assertDocumentStorageRequirements(
    storageKind: DocumentStorageKind,
    storagePath: string | undefined,
    contentBytea: Buffer | null,
  ) {
    if (
      [DocumentStorageKind.LOCAL_PATH, DocumentStorageKind.OBJECT_STORAGE].includes(
        storageKind,
      ) &&
      !this.optionalText(storagePath)
    ) {
      throw new BadRequestException(
        'Se requiere storagePath cuando el archivo no se guarda dentro de la base de datos.',
      );
    }

    if (storageKind === DocumentStorageKind.DATABASE && !contentBytea) {
      throw new BadRequestException(
        'Se requiere contentBase64 cuando storageKind es DATABASE.',
      );
    }
  }

  private parseBase64(value: string, fieldName: string) {
    const normalized = this.requireText(value, fieldName);

    try {
      const parsed = Buffer.from(normalized, 'base64');
      if (parsed.length === 0) {
        throw new Error('empty');
      }

      return parsed;
    } catch {
      throw new BadRequestException(
        `El campo ${fieldName} debe contener un contenido base64 valido.`,
      );
    }
  }

  private async findVehicleOrFail(id: string, fieldName: string) {
    const vehicle = await this.vehicleRepository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!vehicle) {
      throw new NotFoundException('No se encontro el vehiculo indicado.');
    }

    return vehicle;
  }

  private async findPartyOrFail(id: string, fieldName: string) {
    const party = await this.partyRepository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!party) {
      throw new NotFoundException('No se encontro la parte indicada.');
    }

    return party;
  }

  private async findUserOrFail(id: string, fieldName: string) {
    const user = await this.userRepository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!user) {
      throw new NotFoundException('No se encontro el usuario indicado.');
    }

    return user;
  }

  private ensureEnumValue<T extends string>(
    value: T,
    enumeration: Record<string, T>,
    fieldName: string,
  ) {
    if (!Object.values(enumeration).includes(value)) {
      throw new BadRequestException(`El campo ${fieldName} no es valido.`);
    }

    return value;
  }

  private requireText(value: string | undefined | null, fieldName: string) {
    const normalized = this.optionalText(value);

    if (!normalized) {
      throw new BadRequestException(`El campo ${fieldName} es obligatorio.`);
    }

    return normalized;
  }

  private optionalText(value: string | undefined | null) {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeId(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);

    if (!/^\d+$/.test(normalized)) {
      throw new BadRequestException(
        `El campo ${fieldName} debe ser un identificador numerico.`,
      );
    }

    return normalized;
  }

  private parseDateOnly(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new BadRequestException(
        `El campo ${fieldName} debe tener formato YYYY-MM-DD.`,
      );
    }

    const parsed = new Date(`${normalized}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`El campo ${fieldName} no contiene una fecha valida.`);
    }

    return normalized;
  }

  private parseDateTime(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        `El campo ${fieldName} no contiene una fecha-hora valida.`,
      );
    }

    return parsed;
  }

  private parseDateOnlyToDate(dateValue: string) {
    const [year, month, day] = dateValue.split('-').map((value) => Number(value));
    return new Date(year, month - 1, day);
  }

  private compareDateLike(left: string, right: string) {
    return (
      this.parseDateOnlyToDate(left).getTime() - this.parseDateOnlyToDate(right).getTime()
    );
  }

  private describeOperationalError(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Ocurrio un error no identificado durante la operacion.';
  }
}
