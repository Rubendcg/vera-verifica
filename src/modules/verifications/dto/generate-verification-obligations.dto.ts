import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class GenerateVerificationObligationsDto {
  referenceDate?: string;
  vehicleId?: string;
  regime?: VehicleRegime;
  verificationType?: VerificationType;
  adminUserId?: string;
  previewOnly?: boolean | string;
  includeUpcomingWindow?: boolean | string;
}
