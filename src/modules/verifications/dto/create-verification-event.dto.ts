import {
  VerificationResultStatus,
  VerificationType,
} from '../entities/verifications.enums';

export class CreateVerificationEventDto {
  vehicleId!: string;
  centerId?: string;
  verificationType!: VerificationType;
  eventDate!: string;
  validUntil!: string;
  resultStatus?: VerificationResultStatus;
  certificateFolio?: string;
  observations?: string;
  verificationObligationId?: string;
  adminUserId?: string;
  completionNotes?: string;
}
