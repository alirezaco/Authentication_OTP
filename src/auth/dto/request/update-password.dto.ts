import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UpdatePasswordWithoutOldPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(100000)
  @Max(1000000)
  @Type(() => Number)
  code: number;

  @IsString()
  @Matches(/^(9|09)[0|1|2|3][0-9]{8}$/, {
    message: 'invalid cell number format',
  })
  @IsNotEmpty()
  cellNumber: string;
}
