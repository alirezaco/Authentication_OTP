import { Injectable } from '@nestjs/common';
import { GlobalMessageEnum } from './shared/enum/message.enum';

@Injectable()
export class AppService {
  getHello(): string {
    return GlobalMessageEnum.SUCCESS_RUN_MESSAGE;
  }
}
