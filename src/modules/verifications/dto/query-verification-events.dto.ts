import {
  VerificationResultStatus,
  VerificationType,
} from '../entities/verifications.enums';

export class QueryVerificationEventsDto {
  vehicleId?: string;
  centerId?: string;
  verificationType?: VerificationType;
  resultStatus?: VerificationResultStatus;
  fromDate?: string;
  toDate?: string;
}
