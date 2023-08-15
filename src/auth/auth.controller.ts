import { AppEndPointsEnum } from '../shared/enum/end-points/app.enum';
import { AuthEndPointsEnum } from '../shared/enum/end-points/auth.enum';
import { AuthErrorEnum, AuthSuccessEnum } from './enums/auth-message.enum';
import { AuthLogMessage } from './enums/auth-log-message.enum';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RoleEnum } from './enums/role.enum';
import { SendSMSCodeDto } from './dto/request/send-sms-code.dto';
import { SigninDto } from './dto/request/signin.dto';
import { SignupDto } from './dto/request/signup.dto';
import { SuccessResponse } from '../shared/dto/response/response.dto';
import { UpdatePasswordWithoutOldPasswordDto } from './dto/request/update-password.dto';
import { User } from '../user/schema/user.schema';
import { UserDto } from '../user/dto/response/user.dto';
import { UserService } from '../user/user.service';
import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';

@Controller(AppEndPointsEnum.AUTH)
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post(AuthEndPointsEnum.SIGNIN)
  async signin(@Body() { username, password }: SigninDto) {
    const user = await this.userService.checkExistUserForLogin(username);

    await this.authService.checkBanUser(user);

    await this.authService.checkTimingBanUser(user._id);

    try {
      await this.userService.compareUserPassword(user.password, password);

      const token = await this.authService.generateJwtToken(user._id);

      await this.authService.storeUserToken(user, token);

      if (user.role === RoleEnum.SUPER_ADMIN) {
        this.logger.verbose(AuthLogMessage.LOGIN_ADMIN + user.username);
      }

      return new SuccessResponse(
        {
          user: new UserDto(user),
          token,
        },
        AuthSuccessEnum.SUCCESS_LOGIN,
      );
    } catch (error) {
      await this.authService.failedSignin(user._id);
    }
  }

  @Post(AuthEndPointsEnum.SMS_CODE)
  async sendSMSCode(@Body() { cellNumber, email, username }: SendSMSCodeDto) {
    if (username) {
      //check exist username
      await this.userService.checkExistUserByUsername(username);
    }

    if (email) {
      //check exist email
      await this.userService.checkExistUserByEmail(email);

      //check exist cellNumber
      await this.userService.checkExistUserByCellNumber(cellNumber);
    }

    const status = await this.authService.sendSMSCode(cellNumber);

    if (status) {
      return new SuccessResponse({}, AuthSuccessEnum.SUCCESS_SEND_SMS);
    } else {
      return new SuccessResponse({}, AuthErrorEnum.EXIST_CODE);
    }
  }

  @Post(AuthEndPointsEnum.SIGNUP)
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.CheckSmsCode(signupDto.cellNumber, signupDto.code);

    const user = await this.userService.create(signupDto);

    const token = await this.authService.generateJwtToken(user._id);

    await this.authService.storeUserToken(user, token);

    return new SuccessResponse(
      { user: new UserDto(user), token },
      AuthSuccessEnum.SUCCESS_SIGNUP,
    );
  }

  @Post(AuthEndPointsEnum.UPDATE_PASSWORD)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordWithoutOldPasswordDto,
  ) {
    const user = await this.authService.forgetPassword(updatePasswordDto);

    return new SuccessResponse(new UserDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(AuthEndPointsEnum.LOGOUT)
  async logout(@GetUser() user: User) {
    await this.authService.logout(user.id);
    return new SuccessResponse(null, AuthSuccessEnum.LOG_OUT);
  }
}
