import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/src/user/dto/request/create-user.dto';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto extends PickType(CreateUserDto, [
  'cellNumber',
  'email',
  'password',
  'username',
]) {
  @IsNumber()
  @IsNotEmpty()
  @Min(100000)
  @Max(1000000)
  @Type(() => Number)
  code: number;
}
