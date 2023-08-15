import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'invalid new password format',
  })
  @IsNotEmpty()
  password: string;
}
