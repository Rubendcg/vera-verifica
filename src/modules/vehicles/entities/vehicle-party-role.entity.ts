import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Party } from '../../parties/entities/party.entity';
import { Vehicle } from './vehicle.entity';

export enum VehiclePartyRoleType {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  LEGAL_POSSESSOR = 'LEGAL_POSSESSOR',
  PERMISSION_HOLDER = 'PERMISSION_HOLDER',
  CARD_HOLDER = 'CARD_HOLDER',
  MANAGER = 'MANAGER',
  RELATED = 'RELATED',
}

@Entity({ name: 'vehicle_party_roles' })
export class VehiclePartyRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.roles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => Party, (party) => party.vehicleRoles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id' })
  party!: Party;

  @Column({
    name: 'role_type',
    type: 'enum',
    enum: VehiclePartyRoleType,
  })
  roleType!: VehiclePartyRoleType;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ name: 'is_current', type: 'boolean', default: true })
  isCurrent!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
