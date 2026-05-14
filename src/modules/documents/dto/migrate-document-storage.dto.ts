import { Transform } from 'class-transformer';
import {
  IsBoolean,
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
  toOptionalTrimmedString,
} from '../../../common/dto/transform.helpers';

export class MigrateDocumentStorageDto {
  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  documentId?: string;

  @Transform(toOptionalTrimmedString)
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  fileId?: string;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  onlyCurrent?: boolean;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  deleteSourceAfterMigration?: boolean;

  @Transform(toBooleanLike)
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @Transform(toNumberLike)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;
}
