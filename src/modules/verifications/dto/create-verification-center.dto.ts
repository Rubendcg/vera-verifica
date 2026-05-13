import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  toBooleanLike,
  toOptionalTrimmedString,
  toUppercaseTrimmedString,
} from '../../../common/dto/transform.helpers';

export class CreateVerificationCenterDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  centerType!: string;

  @Transform(toUppercaseTrimmedString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Transform(toUppercaseTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(10)
  stateCode?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactName?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
