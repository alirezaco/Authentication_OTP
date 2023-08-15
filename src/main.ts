import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppEndPointsEnum } from './shared/enum/end-points/app.enum';
import { GlobalMessageEnum } from './shared/enum/message.enum';
import { FilterFieldsPipe } from './shared/pipes/filter-fields.pipe';
import { TrimStringPipe } from './shared/pipes/trim-string.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  //get config service
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(AppEndPointsEnum.PREFIX);

  //add global pipe
  app.useGlobalPipes(
    new TrimStringPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
    new FilterFieldsPipe(),
  );

  //run app
  app.enableShutdownHooks();

  const port = configService.get('app.port');
  await app.listen(port);

  new Logger(bootstrap.name).log(GlobalMessageEnum.RUN + port);
}
bootstrap();
