import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PaginationValidationDto } from './pagination.dto';
import { SortValidation } from './sort.dto';

export class BaseFilter {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationValidationDto)
  pagination: PaginationValidationDto;

  @IsArray()
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @ValidateNested()
  @ArrayMinSize(0)
  @Type(() => SortValidation)
  sort: SortValidation[];
}

export class BaseFilterFields {
  @IsNumber({})
  @IsOptional()
  createAt?: number;

  @IsNumber({})
  @IsOptional()
  updateAt?: number;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean = false;
}
