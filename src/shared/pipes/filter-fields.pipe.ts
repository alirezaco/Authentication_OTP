import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BaseFilter, BaseFilterFields } from '../dto/request/base-filter.dto';
import { Types, isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class FilterFieldsPipe implements PipeTransform {
  transform(
    value: BaseFilter & { filter: BaseFilterFields },
    metadata: ArgumentMetadata,
  ) {
    if (value?.filter && metadata.type === 'body') {
      let filterRequest = {};
      let filterItem = {};

      filterRequest['sort'] = value.sort;
      filterRequest['pagination'] = value.pagination;

      for (const item in value.filter) {
        if (isObjectIdOrHexString(value.filter[item])) {
          filterItem[item] = new Types.ObjectId(value.filter[item]);
        } else if (typeof value.filter[item] == 'string') {
          filterItem[item] = { $regex: value.filter[item] };
        } else if (Array.isArray(value.filter[item])) {
          if (value.filter[item][0]) {
            filterItem[item] = { $in: value.filter[item] };
          }
        } else {
          filterItem[item] = value.filter[item];
        }
      }
      filterRequest['filter'] = filterItem;
      return filterRequest;
    }

    return value;
  }
}
