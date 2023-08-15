import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { SignupDto } from './signup.dto';

export class SendSMSCodeDto extends PartialType(OmitType(SignupDto, ['code'])) {
  @IsString()
  @Matches(/^(9|09)[0|1|2|3][0-9]{8}$/, {
    message: 'invalid cell number format',
  })
  @IsNotEmpty()
  cellNumber: string;
}
