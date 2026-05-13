import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class QueryVerificationScheduleRulesDto {
  regime?: VehicleRegime;
  verificationType?: VerificationType;
  scheduleMarker?: string;
  isActive?: string;
}
