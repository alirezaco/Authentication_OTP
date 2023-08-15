import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { BaseFilter } from '../dto/request/base-filter.dto';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  private switchCase(el: any) {
    if (typeof el === 'string') {
      return this.trimString(el);
    }

    if (typeof el === 'object') {
      if (Array.isArray(el)) {
        return this.trimArrayString(el);
      } else {
        return this.trimObject(el);
      }
    }

    return el;
  }

  private trimString(text: string) {
    return text.trim();
  }

  private trimArrayString(array: Array<any>) {
    for (const index in array) {
      array[index] = this.switchCase(array[index]);
    }
    return array;
  }

  private trimObject(object: Object) {
    for (const key in object) {
      object[key] = this.switchCase(object[key]);
    }
    return object;
  }

  transform(value: BaseFilter, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      value = this.switchCase(value);
    }

    return value;
  }
}
