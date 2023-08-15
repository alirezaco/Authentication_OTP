import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse } from './shared/dto/response/response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return new SuccessResponse(null, this.appService.getHello());
  }
}
