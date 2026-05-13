import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from './verifications.enums';

@Entity({ name: 'verification_schedule_rules' })
@Unique('UQ_verification_schedule_rules_scope', [
  'regime',
  'schedulePosition',
  'scheduleMarker',
  'verificationType',
  'windowSequence',
])
@Check('CHK_verification_schedule_rules_window_start_month', '"window_start_month" BETWEEN 1 AND 12')
@Check('CHK_verification_schedule_rules_window_end_month', '"window_end_month" BETWEEN 1 AND 12')
@Check('CHK_verification_schedule_rules_schedule_position', '"schedule_position" BETWEEN 1 AND 10')
@Check('CHK_verification_schedule_rules_window_sequence', '"window_sequence" BETWEEN 1 AND 12')
export class VerificationScheduleRule {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    type: 'enum',
    enum: VehicleRegime,
  })
  regime!: VehicleRegime;

  @Column({ name: 'schedule_position', type: 'smallint' })
  schedulePosition!: number;

  @Column({ name: 'schedule_marker', type: 'char', length: 1 })
  scheduleMarker!: string;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
  })
  verificationType!: VerificationType;

  @Column({ name: 'window_sequence', type: 'smallint', default: 1 })
  windowSequence!: number;

  @Column({ name: 'window_start_month', type: 'smallint' })
  windowStartMonth!: number;

  @Column({ name: 'window_end_month', type: 'smallint' })
  windowEndMonth!: number;

  @Column({ name: 'window_label', type: 'varchar', length: 50 })
  windowLabel!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
