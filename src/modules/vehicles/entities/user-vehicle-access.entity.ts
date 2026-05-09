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
import { Vehicle } from './vehicle.entity';

export enum UserVehicleAccessType {
  OWNER_PORTAL = 'OWNER_PORTAL',
  AUTHORIZED_PORTAL = 'AUTHORIZED_PORTAL',
  ADMIN_ASSIGNED = 'ADMIN_ASSIGNED',
}

@Entity({ name: 'user_vehicle_access' })
@Unique('UQ_user_vehicle_access_user_vehicle', ['user', 'vehicle'])
export class UserVehicleAccess {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => User, (user) => user.vehicleAccesses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.userAccesses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @Column({
    name: 'access_type',
    type: 'enum',
    enum: UserVehicleAccessType,
  })
  accessType!: UserVehicleAccessType;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => User, (user) => user.grantedVehicleAccesses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'granted_by_user_id' })
  grantedByUser!: User | null;

  @Column({ name: 'granted_at', type: 'timestamptz', default: () => 'now()' })
  grantedAt!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
