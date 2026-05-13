import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';
import {
  VerificationResultStatus,
  VerificationType,
} from '../entities/verifications.enums';

export class QueryVerificationEventsDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  vehicleId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  centerId?: string;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @IsOptional()
  @IsEnum(VerificationResultStatus)
  resultStatus?: VerificationResultStatus;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fromDate?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  toDate?: string;
}
