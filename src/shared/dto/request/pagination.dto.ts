import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class PaginationValidationDto {
  @Max(50)
  @Min(1)
  @IsNumber({})
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @IsNumber({})
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
