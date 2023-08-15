import { HttpStatus } from '@nestjs/common';
import { PaginationValidationDto } from '../request/pagination.dto';

export class MetaDataDto {
  total: number;

  nextPage: number;

  totalPage: number;

  access_token?: string;
}

export class BaseSuccessResponse<type> {
  metadata?: MetaDataDto;
  data: type;
  message?: string;
  statusCode: number;
}

export class SuccessResponse<type> extends BaseSuccessResponse<type> {
  constructor(
    data: type,
    message?: string,
    statusCode: number = HttpStatus.OK,
  ) {
    super();

    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class SuccessPaginationResponse<type> extends BaseSuccessResponse<type> {
  constructor(
    data: type,
    { limit, page }: PaginationValidationDto,
    total: number,
    message?: string,
  ) {
    super();

    this.data = data;
    this.metadata = {
      total,
      nextPage: Math.ceil(total / limit) === page ? page : page + 1,
      totalPage: Math.ceil(total / limit),
    };
    this.message = message;
    this.statusCode = HttpStatus.OK;
  }
}
