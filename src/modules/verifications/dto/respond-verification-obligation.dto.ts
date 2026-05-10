import { VerificationOwnerResponse } from '../entities/verifications.enums';

export class RespondVerificationObligationDto {
  ownerUserId!: string;
  ownerResponse!: VerificationOwnerResponse;
  notes?: string;
}
