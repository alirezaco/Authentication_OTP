import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { OrderStateEnum } from '../../enum/order-state.enum';

export class SortValidation {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsString()
  @IsEnum(OrderStateEnum)
  @IsNotEmpty()
  order: string;
}
