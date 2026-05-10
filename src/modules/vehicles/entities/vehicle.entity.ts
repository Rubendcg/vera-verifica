import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserVehicleAccess } from './user-vehicle-access.entity';
import { VehiclePartyRole } from './vehicle-party-role.entity';
import { VerificationEvent } from '../../verifications/entities/verification-event.entity';
import { VerificationObligation } from '../../verifications/entities/verification-obligation.entity';

export enum VehicleRegime {
  FEDERAL = 'FEDERAL',
  ESTATAL = 'ESTATAL',
}

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  plate!: string;

  @Column({
    name: 'serial_niv',
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  serialNiv!: string | null;

  @Column({ name: 'engine_number', type: 'varchar', length: 100, nullable: true })
  engineNumber!: string | null;

  @Column({ name: 'unit_type', type: 'varchar', length: 100 })
  unitType!: string;

  @Column({
    type: 'enum',
    enum: VehicleRegime,
  })
  regime!: VehicleRegime;

  @Column({ name: 'schedule_marker_auto', type: 'char', length: 1 })
  scheduleMarkerAuto!: string;

  @Column({ name: 'schedule_marker_override', type: 'char', length: 1, nullable: true })
  scheduleMarkerOverride!: string | null;

  @Column({ name: 'schedule_marker_effective', type: 'char', length: 1 })
  scheduleMarkerEffective!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => VehiclePartyRole, (role) => role.vehicle)
  roles!: VehiclePartyRole[];

  @OneToMany(() => UserVehicleAccess, (access) => access.vehicle)
  userAccesses!: UserVehicleAccess[];

  @OneToMany(() => VerificationEvent, (event) => event.vehicle)
  verificationEvents!: VerificationEvent[];

  @OneToMany(() => VerificationObligation, (obligation) => obligation.vehicle)
  verificationObligations!: VerificationObligation[];
}
