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
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { VerificationCenter } from './verification-center.entity';
import { VerificationObligation } from './verification-obligation.entity';
import {
  VerificationResultStatus,
  VerificationType,
} from './verifications.enums';

@Entity({ name: 'verification_events' })
export class VerificationEvent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.verificationEvents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => VerificationCenter, (center) => center.verificationEvents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'center_id' })
  center!: VerificationCenter | null;

  @ManyToOne(() => Document, (document) => document.sourceVerificationEvents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'source_document_id' })
  sourceDocument!: Document | null;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
  })
  verificationType!: VerificationType;

  @Column({ name: 'event_date', type: 'date' })
  eventDate!: string;

  @Column({ name: 'valid_until', type: 'date' })
  validUntil!: string;

  @Column({
    name: 'result_status',
    type: 'enum',
    enum: VerificationResultStatus,
    default: VerificationResultStatus.PASSED,
  })
  resultStatus!: VerificationResultStatus;

  @Column({ name: 'certificate_folio', type: 'varchar', length: 100, nullable: true })
  certificateFolio!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => VerificationObligation, (obligation) => obligation.verificationEvent)
  verificationObligations!: VerificationObligation[];
}
