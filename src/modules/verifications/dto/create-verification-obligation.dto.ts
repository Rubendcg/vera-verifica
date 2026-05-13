import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';
import { VerificationType } from '../entities/verifications.enums';

export class CreateVerificationObligationDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d+$/)
  vehicleId!: string;

  @IsEnum(VerificationType)
  verificationType!: VerificationType;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dueDate!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  windowStartDate!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  windowEndDate!: string;

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
  @MaxLength(1000)
  notes?: string;
}
