import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RoleEnum } from '../auth/enums/role.enum';
import { UserService } from '../user/user.service';
import { SeedMessageEnum } from './enum/message.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.createSuperAdmin();

      this.logger.log(SeedMessageEnum.SUCCESS);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async createSuperAdmin() {
    const superAdmin = await this.userService.findOneByUsername(
      this.configService.get('superAdmin.username'),
    );

    if (superAdmin) {
      this.logger.debug(SeedMessageEnum.EXIST_ADMIN);
    } else {
      await this.userService.createUserInCode({
        username: this.configService.get('superAdmin.username'),
        password: this.configService.get('superAdmin.password'),
        email: this.configService.get('superAdmin.email'),
        cellNumber: this.configService.get('superAdmin.phone'),
        role: RoleEnum.SUPER_ADMIN,
        isDeleted: false,
        isBanned: false,
      });

      this.logger.debug(SeedMessageEnum.CREATE_ADMIN);
    }
  }
}
