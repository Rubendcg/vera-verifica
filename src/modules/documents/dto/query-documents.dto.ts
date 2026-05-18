import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import {
  toBooleanLike,
  toOptionalTrimmedString,
} from '../../../common/dto/transform.helpers';
import { VerificationType } from '../../verifications/entities/verifications.enums';
import { DocumentStatus, DocumentType } from '../entities/documents.enums';

export class QueryDocumentsDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  vehicleId?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @IsOptional()
  @IsEnum(DocumentStatus)
  documentStatus?: DocumentStatus;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isVisibleToOwner?: boolean;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  onlyWithCurrentFile?: boolean;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
