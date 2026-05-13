import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  toBooleanLike,
  toNumberLike,
  toUppercaseTrimmedString,
} from '../../../common/dto/transform.helpers';
import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class QueryVerificationScheduleRulesDto {
  @IsOptional()
  @IsEnum(VehicleRegime)
  regime?: VehicleRegime;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @Transform(toUppercaseTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]$/)
  scheduleMarker?: string;

  @Transform(toNumberLike)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  windowSequence?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isActive?: string;
}
