import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  toBooleanLike,
  toOptionalTrimmedString,
} from '../../../common/dto/transform.helpers';
import { VerificationType } from '../../verifications/entities/verifications.enums';
import { DocumentStatus, DocumentType } from '../entities/documents.enums';

export class CreateDocumentDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @Matches(/^\d+$/)
  vehicleId!: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  relatedPartyId?: string;

  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  documentNumber?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  issueDate?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  validUntil?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  documentStatus?: DocumentStatus;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  isVisibleToOwner?: boolean;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
