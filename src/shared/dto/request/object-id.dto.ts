import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ObjectIdDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  id: string;
}
