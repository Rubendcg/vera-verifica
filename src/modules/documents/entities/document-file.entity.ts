import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  DocumentOcrStatus,
  DocumentStorageKind,
} from './documents.enums';
import { Document } from './document.entity';

@Entity({ name: 'document_files' })
@Unique('UQ_document_files_document_version', ['document', 'versionNo'])
export class DocumentFile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Document, (document) => document.files, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document!: Document;

  @ManyToOne(() => User, (user) => user.uploadedDocumentFiles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedByUser!: User | null;

  @Column({ name: 'version_no', type: 'integer' })
  versionNo!: number;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType!: string;

  @Column({ name: 'original_file_name', type: 'varchar', length: 255 })
  originalFileName!: string;

  @Column({
    name: 'storage_kind',
    type: 'enum',
    enum: DocumentStorageKind,
    default: DocumentStorageKind.LOCAL_PATH,
  })
  storageKind!: DocumentStorageKind;

  @Column({ name: 'storage_path', type: 'varchar', length: 500, nullable: true })
  storagePath!: string | null;

  @Column({ name: 'content_bytea', type: 'bytea', nullable: true })
  contentBytea!: Buffer | null;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes!: string | null;

  @Column({ name: 'sha256_hex', type: 'varchar', length: 64, nullable: true })
  sha256Hex!: string | null;

  @Column({ name: 'page_count', type: 'integer', nullable: true })
  pageCount!: number | null;

  @Column({ name: 'scanned_at', type: 'timestamptz', nullable: true })
  scannedAt!: Date | null;

  @Column({
    name: 'ocr_status',
    type: 'enum',
    enum: DocumentOcrStatus,
    default: DocumentOcrStatus.NOT_REQUESTED,
  })
  ocrStatus!: DocumentOcrStatus;

  @Column({ name: 'ocr_text', type: 'text', nullable: true })
  ocrText!: string | null;

  @Column({ name: 'is_current', type: 'boolean', default: true })
  isCurrent!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
