import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';
import {
  VerificationResultStatus,
  VerificationType,
} from '../entities/verifications.enums';

export class CreateVerificationEventDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d+$/)
  vehicleId!: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  centerId?: string;

  @IsEnum(VerificationType)
  verificationType!: VerificationType;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  eventDate!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  validUntil!: string;

  @IsOptional()
  @IsEnum(VerificationResultStatus)
  resultStatus?: VerificationResultStatus;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateFolio?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observations?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  verificationObligationId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  adminUserId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  completionNotes?: string;
}
