import { UserDto } from '@/src/user/dto/response/user.dto';
import { BaseResponseWithoutCreator } from './base-response-without-creator.dto';

export class BaseResponse extends BaseResponseWithoutCreator {
  public creator: Pick<UserDto, 'id' | 'username'>;

  constructor(initial?: Partial<BaseResponse>) {
    super(initial);

    if (initial.creator && typeof initial.creator.id === 'string') {
      this.creator = {
        username: initial.creator.username,
        id: initial.creator.id,
      };
    }
  }
}
