import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';
import { VerificationOwnerResponse } from '../entities/verifications.enums';

export class RespondVerificationObligationDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  ownerUserId!: string;

  @IsEnum(VerificationOwnerResponse)
  ownerResponse!: VerificationOwnerResponse;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
