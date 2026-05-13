import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { VerificationCenter } from './verification-center.entity';
import { VerificationEvent } from './verification-event.entity';
import { VerificationObligationHistory } from './verification-obligation-history.entity';
import {
  VerificationObligationStatus,
  VerificationOwnerResponse,
  VerificationType,
} from './verifications.enums';

@Entity({ name: 'verification_obligations' })
@Unique('UQ_verification_obligations_vehicle_type_due_date', [
  'vehicle',
  'verificationType',
  'dueDate',
])
export class VerificationObligation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.verificationObligations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
  })
  verificationType!: VerificationType;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: string;

  @Column({ name: 'window_start_date', type: 'date' })
  windowStartDate!: string;

  @Column({ name: 'window_end_date', type: 'date' })
  windowEndDate!: string;

  @Column({
    type: 'enum',
    enum: VerificationObligationStatus,
    default: VerificationObligationStatus.PENDING,
  })
  status!: VerificationObligationStatus;

  @Column({
    name: 'owner_response',
    type: 'enum',
    enum: VerificationOwnerResponse,
    nullable: true,
  })
  ownerResponse!: VerificationOwnerResponse | null;

  @Column({ name: 'owner_response_at', type: 'timestamptz', nullable: true })
  ownerResponseAt!: Date | null;

  @ManyToOne(() => User, (user) => user.ownerVerificationResponses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser!: User | null;

  @ManyToOne(() => User, (user) => user.adminVerificationUpdates, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'admin_user_id' })
  adminUser!: User | null;

  @ManyToOne(() => VerificationCenter, (center) => center.verificationObligations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'scheduled_center_id' })
  scheduledCenter!: VerificationCenter | null;

  @Column({ name: 'scheduled_for', type: 'timestamptz', nullable: true })
  scheduledFor!: Date | null;

  @ManyToOne(() => VerificationEvent, (event) => event.verificationObligations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'verification_event_id' })
  verificationEvent!: VerificationEvent | null;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => VerificationObligationHistory, (history) => history.obligation)
  historyEntries!: VerificationObligationHistory[];
}
