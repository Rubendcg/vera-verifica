import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Party } from '../parties/entities/party.entity';
import { User } from '../users/entities/user.entity';
import { UserVehicleAccess } from '../vehicles/entities/user-vehicle-access.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { DocumentFile } from './entities/document-file.entity';
import { Document } from './entities/document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentsStorageService } from './storage/documents-storage.service';
import { LocalDocumentsStorageBackend } from './storage/local-documents-storage.backend';
import { ObjectStorageDocumentsStorageBackend } from './storage/object-storage-documents-storage.backend';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Party,
      User,
      Vehicle,
      UserVehicleAccess,
      Document,
      DocumentFile,
    ]),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentsStorageService,
    LocalDocumentsStorageBackend,
    ObjectStorageDocumentsStorageBackend,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
