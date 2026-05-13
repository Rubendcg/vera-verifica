import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  toBooleanLike,
  toOptionalTrimmedString,
} from '../../../common/dto/transform.helpers';
import {
  VerificationObligationStatus,
  VerificationOwnerResponse,
  VerificationType,
} from '../entities/verifications.enums';

export class QueryVerificationObligationsDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  vehicleId?: string;

  @IsOptional()
  @IsEnum(VerificationObligationStatus)
  status?: VerificationObligationStatus;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @IsOptional()
  @IsEnum(VerificationOwnerResponse)
  ownerResponse?: VerificationOwnerResponse;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  ownerUserId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  adminUserId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dueFrom?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dueTo?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  includeHistory?: string;
}
