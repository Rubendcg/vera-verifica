import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  toNumberLike,
  toOptionalTrimmedString,
} from '../../../common/dto/transform.helpers';
import { DocumentOcrStatus, DocumentStorageKind } from '../entities/documents.enums';

export class CreateDocumentFileDto {
  @Transform(toOptionalTrimmedString)
  @IsString()
  @MaxLength(100)
  mimeType!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @MaxLength(255)
  originalFileName!: string;

  @IsOptional()
  @IsEnum(DocumentStorageKind)
  storageKind?: DocumentStorageKind;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  storagePath?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  contentBase64?: string;

  @Transform(toNumberLike)
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^[a-fA-F0-9]{64}$/)
  sha256Hex?: string;

  @Transform(toNumberLike)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  pageCount?: number;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @IsISO8601()
  scannedAt?: string;

  @IsOptional()
  @IsEnum(DocumentOcrStatus)
  ocrStatus?: DocumentOcrStatus;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  ocrText?: string;
}
