import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheKeysEnum } from '../shared/enum/cache-keys.enum';
import { SmsServerProxy } from '../shared/proxies/sms-server.proxy';
import { CacheProxy } from '../shared/utils/cache.proxy';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { UpdatePasswordWithoutOldPasswordDto } from './dto/request/update-password.dto';
import { AuthErrorEnum } from './enums/auth-message.enum';
import {
  IBanPayload,
  ICachePayload,
} from './interfaces/cache-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private cacheProxy: CacheProxy,
    private readonly userService: UserService,
    private smsServerProxy: SmsServerProxy,
  ) {}
  generateJwtToken(id: string) {
    return this.jwtTokenService.signAsync({ id });
  }

  async sendSMSCode(cellNumber: string) {
    const code = await this.generateSmsCodeAndStore(cellNumber);

    if (!code) {
      return false;
    }

    await this.smsServerProxy.send(cellNumber, code.toString());

    return true;
  }

  async loginBySMSCode(user: User) {
    const token = await this.generateJwtToken(user._id);

    await this.storeUserToken(user, token);

    return token;
  }

  async storeUserToken(user: User, token: string) {
    const data: ICachePayload = {
      id: user._id,
      username: user.username,
      lastLogin: Date.now(),
      token,
      count: 0,
    };

    await this.cacheProxy.insertData(CacheKeysEnum.LOGIN + user._id, data);
  }

  async checkUserTokenInCache(id: string, token: string) {
    const payload: ICachePayload = await this.cacheProxy.getData(
      CacheKeysEnum.LOGIN + id,
    );

    if (!(payload && payload.token === token)) {
      new BadRequestException(AuthErrorEnum.LOGIN_REQUIRED);
    }
  }

  async checkTimingBanUser(id: string) {
    const data: IBanPayload = await this.cacheProxy.getData(
      CacheKeysEnum.BAN + id,
    );

    if (
      data &&
      Math.pow(data.count, 2) * 5 * 60 * 1000 + data.timeBan > Date.now()
    ) {
      new BadRequestException(AuthErrorEnum.BAN_USER);
    }
  }

  async timeBanUser(id: string) {
    const key = CacheKeysEnum.BAN + id;

    const data: IBanPayload = await this.cacheProxy.getData(key);

    if (data) {
      await this.cacheProxy.incrFieldValue(key, 'count');
    } else {
      const payload: IBanPayload = {
        id,
        timeBan: Date.now(),
        count: 1,
      };

      await this.cacheProxy.insertData(key, payload);
    }
  }

  async failedSignin(id: string) {
    const data: IBanPayload = await this.cacheProxy.getData(
      CacheKeysEnum.BAN + id,
    );

    const cachePayload: ICachePayload = await await this.cacheProxy.getData(
      CacheKeysEnum.LOGIN + id,
    );

    if (data?.count === 5) {
      await this.userService.banUser(id);
      new BadRequestException(AuthErrorEnum.BAN_USER);
    }

    if (cachePayload) {
      if (cachePayload.count === 4) {
        await this.timeBanUser(id);
        await this.cacheProxy.insertData(CacheKeysEnum.LOGIN + id, {
          ...cachePayload,
          count: 1,
        });
      } else {
        await this.cacheProxy.incrFieldValue(CacheKeysEnum.LOGIN + id, 'count');
      }
    } else {
      await this.cacheProxy.insertData(CacheKeysEnum.LOGIN + id, {
        count: 1,
      });
    }

    throw new BadRequestException(AuthErrorEnum.NOT_MATCH);
  }

  async logout(id: string) {
    await this.cacheProxy.deleteData(CacheKeysEnum.LOGIN + id);
  }

  async checkBanUser(user: User) {
    if (user.isBanned) {
      new BadRequestException(AuthErrorEnum.BAN_USER);
    }
  }

  async forgetPassword({
    newPassword,
    code,
    cellNumber,
  }: UpdatePasswordWithoutOldPasswordDto) {
    await this.CheckSmsCode(cellNumber, code);

    const user = await this.userService.findOneByCellNumber(cellNumber);

    return this.userService.changePassword(user._id, newPassword);
  }

  async CheckSmsCode(phoneNumber: string, code: number) {
    const data: { code: number } = await this.cacheProxy.getData(
      CacheKeysEnum.SMS_CODE + phoneNumber,
    );

    if (data && data.code === code) {
      return true;
    }

    new BadRequestException(AuthErrorEnum.INVALID_CODE);
  }

  async generateSmsCodeAndStore(phoneNumber: string) {
    const data: { code: number; createAt: number } =
      await this.cacheProxy.getData(CacheKeysEnum.SMS_CODE + phoneNumber);

    if (data && data.createAt + 1000 * 60 * 2 > Date.now()) {
      return '';
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    await this.cacheProxy.insertData(
      CacheKeysEnum.SMS_CODE + phoneNumber,
      {
        code,
        createAt: Date.now(),
      },
      1000 * 60 * 15,
    );

    return code;
  }
}
