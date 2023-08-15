import { AppEndPointsEnum } from '@/src/shared/enum/end-points/app.enum';
import { AuthDec } from '@/src/auth/decorators/auth.decorator';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { FilterUserDto } from '../dto/request/filter-user.dto';
import { FormatFilterUser } from '../pipes/format-filter.dto';
import { GetUser } from '@/src/auth/decorators/user.decorator';
import { ObjectIdDto } from '@/src/shared/dto/request/object-id.dto';
import { RoleEnum } from '@/src/auth/enums/role.enum';
import { SortPipe } from '@/src/shared/pipes/sort.pipe';
import { UpdatePasswordByAdminDto } from '../dto/request/update-password-by-admin.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { User } from '../schema/user.schema';
import { UserDto } from '../dto/response/user.dto';
import { UserEndPointsEnum } from '@/src/shared/enum/end-points/user.enum';
import { UserMessageEnum } from '../enum/message.enum';
import { UserService } from '../user.service';
import { UserSortFieldsEnum } from '../enum/user-fields.enum';
import {
  SuccessPaginationResponse,
  SuccessResponse,
} from '@/src/shared/dto/response/response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller(AppEndPointsEnum.USER_ADMIN)
@AuthDec(RoleEnum.SUPER_ADMIN)
export class UserSuperAdminController {
  private logger = new Logger(UserSuperAdminController.name);

  constructor(private readonly userService: UserService) {}

  @Post(UserEndPointsEnum.CREATE)
  async create(@Body() createUserDto: CreateUserDto, @GetUser() admin: User) {
    const user = await this.userService.create(createUserDto);

    //log create user by admin
    this.logger.verbose(
      UserMessageEnum.CREATE_USER_BY_ADMIN +
        admin.username +
        ` with username: ${user.username}`,
    );

    return new SuccessResponse(new UserDto(user));
  }

  @Post(UserEndPointsEnum.FIND_ALL)
  async findAll(
    @Body(new SortPipe(UserSortFieldsEnum), new FormatFilterUser())
    filterUserDto: FilterUserDto,
  ) {
    const { data, count } = await this.userService.findAll(filterUserDto);

    return new SuccessPaginationResponse(
      data.map((x) => new UserDto(x)),
      filterUserDto.pagination,
      count,
    );
  }

  @Get(UserEndPointsEnum.FIND_ONE)
  async findOne(@Param() { id }: ObjectIdDto) {
    const user = await this.userService.findOne(id);

    return new SuccessResponse(new UserDto(user));
  }

  @Patch(UserEndPointsEnum.UPDATE_ADMIN)
  async update(
    @Param() { id }: ObjectIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.findOne(id);

    const user = await this.userService.update(id, updateUserDto);

    return new SuccessResponse(new UserDto(user));
  }

  @Patch(UserEndPointsEnum.UPDATE_PASSWORD_ADMIN)
  async updatePassword(
    @Param() { id }: ObjectIdDto,
    @Body() { newPassword }: UpdatePasswordByAdminDto,
  ) {
    await this.userService.findOne(id);

    const user = await this.userService.changePassword(id, newPassword);

    return new SuccessResponse(new UserDto(user));
  }

  @Delete(UserEndPointsEnum.REMOVE_SOFT_ADMIN)
  async removeSoft(@Param() { id }: ObjectIdDto, @GetUser() admin: User) {
    await this.userService.findOne(id);

    const user = await this.userService.removeSoft(id);

    //log delete user by admin
    this.logger.verbose(
      UserMessageEnum.DELETE_USER_BY_ADMIN +
        admin.username +
        ` with username: ${user.username}`,
    );

    return new SuccessResponse(new UserDto(user));
  }

  @Delete(UserEndPointsEnum.REMOVE_HARD)
  async removeHard(@Param() { id }: ObjectIdDto, @GetUser() admin: User) {
    await this.userService.findOne(id);

    const user = await this.userService.removeHard(id);

    //log delete user by admin
    this.logger.verbose(
      UserMessageEnum.DELETE_USER_BY_ADMIN +
        admin.username +
        ` with username: ${user.username}`,
    );

    return new SuccessResponse(new UserDto(user));
  }

  @Head(UserEndPointsEnum.TOGGELE_BAN_USER)
  async toggeleBanUser(@Param() { id }: ObjectIdDto, @GetUser() admin: User) {
    const user = await this.userService.findOne(id);

    if (user.isBanned) {
      await this.userService.unBanUser(user._id);

      //log unban user by admin
      this.logger.verbose(
        UserMessageEnum.UNBAN_USER_BY_ADMIN +
          admin.username +
          ` with username: ${user.username}`,
      );
    } else {
      await this.userService.banUser(user._id);

      //log ban user by admin
      this.logger.verbose(
        UserMessageEnum.BAN_USER_BY_ADMIN +
          admin.username +
          ` with username: ${user.username}`,
      );
    }

    return new SuccessResponse({});
  }

  @Head(UserEndPointsEnum.ADD_NEW_ADMIN)
  async addNewAdmin(@Param() { id }: ObjectIdDto, @GetUser() admin: User) {
    await this.userService.findOne(id);

    const user = await this.userService.setAUserAsAdmin(id);

    //log set a user as admin by admin
    this.logger.verbose(
      UserMessageEnum.ADD_NEW_ADMIN +
        admin.username +
        ` with username: ${user.username}`,
    );

    return new SuccessResponse({});
  }

  @Head(UserEndPointsEnum.REMOVE_ADMIN)
  async removeAdmin(@Param() { id }: ObjectIdDto, @GetUser() admin: User) {
    await this.userService.findOne(id);

    const user = await this.userService.removeAUserAsAdmin(id);

    //log set a user as admin by admin
    this.logger.verbose(
      UserMessageEnum.REMOVE_ADMIN +
        admin.username +
        ` with username: ${user.username}`,
    );

    return new SuccessResponse({});
  }
}
