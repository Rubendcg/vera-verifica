import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';
import { VehiclePartyRole } from '../../vehicles/entities/vehicle-party-role.entity';

export enum PartyType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

@Entity({ name: 'parties' })
export class Party {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'party_type',
    type: 'enum',
    enum: PartyType,
  })
  partyType!: PartyType;

  @Column({ type: 'varchar', length: 13, nullable: true, unique: true })
  rfc!: string | null;

  @Column({ name: 'legal_name', type: 'varchar', length: 255 })
  legalName!: string;

  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => User, (user) => user.party)
  users!: User[];

  @OneToMany(() => VehiclePartyRole, (role) => role.party)
  vehicleRoles!: VehiclePartyRole[];

  @OneToMany(() => Document, (document) => document.relatedParty)
  documents!: Document[];
}
