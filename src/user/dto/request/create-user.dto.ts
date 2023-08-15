import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  @IsOptional()
  firstname?: string;

  @IsString()
  @MaxLength(20)
  @MinLength(3)
  @IsNotEmpty()
  lastname?: string;

  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'invalid password format',
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @Matches(/^(9|09)[0|1|2|3][0-9]{8}$/, {
    message: 'invalid cell number format',
  })
  @IsNotEmpty()
  cellNumber: string;

  @IsString()
  @Matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, {
    message: 'invalid email format',
  })
  @IsNotEmpty()
  email: string;
}
