import { Injectable, PipeTransform } from '@nestjs/common';
import { FilterUserDto } from '../dto/request/filter-user.dto';

@Injectable()
export class FormatFilterUser implements PipeTransform {
  transform(value: FilterUserDto) {
    const filter = [
      { username: value.filter.search },
      { email: value.filter.search },
      { firstname: value.filter.search },
      { lastname: value.filter.search },
    ];

    value.filter['$or'] = filter;

    return value;
  }
}
