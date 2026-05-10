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
import { Document } from '../../documents/entities/document.entity';
import { DocumentFile } from '../../documents/entities/document-file.entity';
import { Party } from '../../parties/entities/party.entity';
import { UserVehicleAccess } from '../../vehicles/entities/user-vehicle-access.entity';
import { VerificationObligationHistory } from '../../verifications/entities/verification-obligation-history.entity';
import { VerificationObligation } from '../../verifications/entities/verification-obligation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Party, (party) => party.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'party_id' })
  party!: Party | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin!: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => UserVehicleAccess, (access) => access.user)
  vehicleAccesses!: UserVehicleAccess[];

  @OneToMany(() => UserVehicleAccess, (access) => access.grantedByUser)
  grantedVehicleAccesses!: UserVehicleAccess[];

  @OneToMany(() => VerificationObligation, (obligation) => obligation.ownerUser)
  ownerVerificationResponses!: VerificationObligation[];

  @OneToMany(() => VerificationObligation, (obligation) => obligation.adminUser)
  adminVerificationUpdates!: VerificationObligation[];

  @OneToMany(() => VerificationObligationHistory, (history) => history.changedByUser)
  verificationObligationHistoryEntries!: VerificationObligationHistory[];

  @OneToMany(() => Document, (document) => document.uploadedByUser)
  uploadedDocuments!: Document[];

  @OneToMany(() => DocumentFile, (documentFile) => documentFile.uploadedByUser)
  uploadedDocumentFiles!: DocumentFile[];
}
