import { VerificationType } from '../entities/verifications.enums';

export class CreateVerificationObligationDto {
  vehicleId!: string;
  verificationType!: VerificationType;
  dueDate!: string;
  windowStartDate!: string;
  windowEndDate!: string;
  ownerUserId?: string;
  adminUserId?: string;
  notes?: string;
}
