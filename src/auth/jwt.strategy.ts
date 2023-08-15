import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthErrorEnum } from './enums/auth-message.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secretKey'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    try {
      const token = req['headers']['authorization'].split(' ')[1];

      const userFound = await this.userService.findOne(payload.id);

      await this.authService.checkBanUser(userFound);

      await this.authService.checkUserTokenInCache(userFound._id, token);

      return userFound;
    } catch (error) {
      throw new UnauthorizedException(AuthErrorEnum.TOKEN_INVALID);
    }
  }
}
