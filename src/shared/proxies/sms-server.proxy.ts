import { Injectable } from '@nestjs/common';
import { kavenegar, KavenegarApi } from 'kavenegar';
import { EnvEnum } from '../enum/env.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsServerProxy {
  apiService: kavenegar.KavenegarInstance;
  constructor(private readonly confgiService: ConfigService) {
    this.apiService = KavenegarApi({
      apikey: confgiService.get('kavenegar.key'),
    });
  }

  async send(cellNumber: string, code: string) {
    return new Promise((resolve, reject) => {
      if (this.confgiService.get('app.env') === EnvEnum.PRODUCTION) {
        this.apiService.VerifyLookup(
          {
            template: 'Verify',
            token: code,
            receptor: cellNumber,
          },
          (_, status, msg) => {
            if (status === 200) {
              resolve(true);
            } else {
              reject(msg);
            }
          },
        );
      } else {
        console.log(code);
        resolve(true);
      }
    });
  }
}
