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
import { VehicleRegime } from '../../vehicles/entities/vehicle.entity';
import { VerificationType } from '../entities/verifications.enums';

export class GenerateVerificationObligationsDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  referenceDate?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  vehicleId?: string;

  @IsOptional()
  @IsEnum(VehicleRegime)
  regime?: VehicleRegime;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  adminUserId?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  previewOnly?: boolean | string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  includeUpcomingWindow?: boolean | string;
}
