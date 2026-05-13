import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Party } from '../../parties/entities/party.entity';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { VerificationEvent } from '../../verifications/entities/verification-event.entity';
import { VerificationType } from '../../verifications/entities/verifications.enums';
import { DocumentStatus, DocumentType } from './documents.enums';
import { DocumentFile } from './document-file.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.documents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => Party, (party) => party.documents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'related_party_id' })
  relatedParty!: Party | null;

  @ManyToOne(() => User, (user) => user.uploadedDocuments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedByUser!: User | null;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
  })
  documentType!: DocumentType;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
    nullable: true,
  })
  verificationType!: VerificationType | null;

  @Column({ name: 'document_number', type: 'varchar', length: 100, nullable: true })
  documentNumber!: string | null;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate!: string | null;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil!: string | null;

  @Column({
    name: 'document_status',
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  documentStatus!: DocumentStatus;

  @Column({ name: 'is_visible_to_owner', type: 'boolean', default: false })
  isVisibleToOwner!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => DocumentFile, (documentFile) => documentFile.document)
  files!: DocumentFile[];

  @OneToMany(
    () => VerificationEvent,
    (verificationEvent) => verificationEvent.sourceDocument,
  )
  sourceVerificationEvents!: VerificationEvent[];
}
