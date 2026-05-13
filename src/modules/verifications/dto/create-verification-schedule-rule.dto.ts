import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class CreateVerificationScheduleRuleDto {
  regime!: VehicleRegime;
  schedulePosition!: number;
  scheduleMarker!: string;
  verificationType!: VerificationType;
  windowSequence?: number;
  windowStartMonth!: number;
  windowEndMonth!: number;
  windowLabel!: string;
  isActive?: boolean;
  notes?: string;
}
