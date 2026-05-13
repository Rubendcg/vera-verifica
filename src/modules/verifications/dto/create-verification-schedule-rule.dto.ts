import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  toBooleanLike,
  toNumberLike,
  toOptionalTrimmedString,
  toUppercaseTrimmedString,
} from '../../../common/dto/transform.helpers';
import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class CreateVerificationScheduleRuleDto {
  @IsEnum(VehicleRegime)
  regime!: VehicleRegime;

  @Transform(toNumberLike)
  @IsInt()
  @Min(1)
  @Max(10)
  schedulePosition!: number;

  @Transform(toUppercaseTrimmedString)
  @IsString()
  @Matches(/^[A-Z0-9]$/)
  scheduleMarker!: string;

  @IsEnum(VerificationType)
  verificationType!: VerificationType;

  @Transform(toNumberLike)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  windowSequence?: number;

  @Transform(toNumberLike)
  @IsInt()
  @Min(1)
  @Max(12)
  windowStartMonth!: number;

  @Transform(toNumberLike)
  @IsInt()
  @Min(1)
  @Max(12)
  windowEndMonth!: number;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @MaxLength(100)
  windowLabel!: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
