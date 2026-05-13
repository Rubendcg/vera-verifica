import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsISO8601,
  Matches,
  MaxLength,
} from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';

export class ScheduleVerificationObligationDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d+$/)
  adminUserId!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d+$/)
  scheduledCenterId!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @IsISO8601()
  scheduledFor!: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
