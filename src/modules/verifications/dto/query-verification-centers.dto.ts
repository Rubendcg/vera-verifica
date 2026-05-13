import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  toBooleanLike,
  toOptionalTrimmedString,
  toUppercaseTrimmedString,
} from '../../../common/dto/transform.helpers';

export class QueryVerificationCentersDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  centerType?: string;

  @Transform(toUppercaseTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(10)
  stateCode?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isActive?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
