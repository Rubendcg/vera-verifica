import {
  VerificationObligationStatus,
  VerificationOwnerResponse,
  VerificationType,
} from '../entities/verifications.enums';

export class QueryVerificationObligationsDto {
  vehicleId?: string;
  status?: VerificationObligationStatus;
  verificationType?: VerificationType;
  ownerResponse?: VerificationOwnerResponse;
  ownerUserId?: string;
  adminUserId?: string;
  dueFrom?: string;
  dueTo?: string;
  includeHistory?: string;
}
