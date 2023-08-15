import { BaseResponseWithoutCreator } from '@/src/shared/dto/response/base-response-without-creator.dto';

export class UserDto extends BaseResponseWithoutCreator {
  firstname?: string;
  lastname?: string;
  username: string;
  cellNumber: string;
  email: string;
  fullname?: string;

  constructor(initial: UserDto) {
    super(initial);

    this.firstname = initial.firstname;
    this.lastname = initial.lastname;
    if (initial.firstname && initial.lastname) {
      this.fullname = initial.firstname + ' ' + initial.lastname;
    }
    this.username = initial.username;
    this.cellNumber = initial.cellNumber;
    this.email = initial.email;
  }
}
