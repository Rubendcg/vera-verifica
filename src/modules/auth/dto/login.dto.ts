import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { toOptionalTrimmedString } from '../../../common/dto/transform.helpers';

export class LoginDto {
  @Transform(toOptionalTrimmedString)
  @IsEmail()
  email!: string;

  @Transform(toOptionalTrimmedString)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
