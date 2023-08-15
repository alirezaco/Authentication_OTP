import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { SuccessResponse } from '../../shared/dto/response/response.dto';
import { UserDto } from '../dto/response/user.dto';
import { AppEndPointsEnum } from '../../shared/enum/end-points/app.enum';
import { UserEndPointsEnum } from '../../shared/enum/end-points/user.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetUser } from '@/src/auth/decorators/user.decorator';
import { User } from '../schema/user.schema';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UpdatePasswordDto } from '../dto/request/update-password.dto';
import { DeleteAccountDto } from '../dto/request/delete-account.dto';

@Controller(AppEndPointsEnum.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(UserEndPointsEnum.WHO_AM_I)
  async whoAmI(@GetUser() user: User) {
    return new SuccessResponse(new UserDto(user));
  }

  @Patch(UserEndPointsEnum.UPDATE)
  async update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    const newUser = await this.userService.update(user._id, updateUserDto);

    return new SuccessResponse(new UserDto(newUser));
  }

  @Patch(UserEndPointsEnum.UPDATE_PASSWORD)
  async updatePassword(
    @Body() { newPassword, oldPassword }: UpdatePasswordDto,
    @GetUser() user: User,
  ) {
    await this.userService.compareUserPassword(user.password, oldPassword);

    const newUser = await this.userService.changePassword(
      user._id,
      newPassword,
    );

    return new SuccessResponse(new UserDto(newUser));
  }

  @Delete(UserEndPointsEnum.REMOVE_SOFT)
  async removeSoft(
    @GetUser() user: User,
    @Body() { password }: DeleteAccountDto,
  ) {
    await this.userService.compareUserPassword(user.password, password);

    const newUser = await this.userService.removeSoft(user._id);

    return new SuccessResponse(new UserDto(newUser));
  }
}
