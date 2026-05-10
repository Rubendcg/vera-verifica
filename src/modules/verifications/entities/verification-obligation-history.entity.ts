import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VerificationObligation } from './verification-obligation.entity';
import {
  VerificationObligationHistoryAction,
  VerificationObligationStatus,
  VerificationOwnerResponse,
} from './verifications.enums';

@Entity({ name: 'verification_obligation_history' })
export class VerificationObligationHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => VerificationObligation, (obligation) => obligation.historyEntries, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'obligation_id' })
  obligation!: VerificationObligation;

  @ManyToOne(() => User, (user) => user.verificationObligationHistoryEntries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'changed_by_user_id' })
  changedByUser!: User | null;

  @Column({
    name: 'action_type',
    type: 'enum',
    enum: VerificationObligationHistoryAction,
  })
  actionType!: VerificationObligationHistoryAction;

  @Column({
    name: 'previous_status',
    type: 'enum',
    enum: VerificationObligationStatus,
    nullable: true,
  })
  previousStatus!: VerificationObligationStatus | null;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: VerificationObligationStatus,
  })
  newStatus!: VerificationObligationStatus;

  @Column({
    name: 'previous_owner_response',
    type: 'enum',
    enum: VerificationOwnerResponse,
    nullable: true,
  })
  previousOwnerResponse!: VerificationOwnerResponse | null;

  @Column({
    name: 'new_owner_response',
    type: 'enum',
    enum: VerificationOwnerResponse,
    nullable: true,
  })
  newOwnerResponse!: VerificationOwnerResponse | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
