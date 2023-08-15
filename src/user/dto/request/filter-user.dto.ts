import {
  BaseFilter,
  BaseFilterFields,
} from '@/src/shared/dto/request/base-filter.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class UserFilterFields extends BaseFilterFields {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  cellNumber: string;
}

export class FilterUserDto extends BaseFilter {
  @IsObject()
  @IsNotEmptyObject({ nullable: false })
  @ValidateNested()
  @Type(() => UserFilterFields)
  filter: UserFilterFields;
}
