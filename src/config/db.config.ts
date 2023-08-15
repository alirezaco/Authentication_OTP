import { Logger } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { GlobalMessageEnum } from 'src/shared/enum/message.enum';

export const DBConfig: MongooseModuleFactoryOptions = {
  connectionFactory: async (connection: Connection) => {
    const logger = new Logger(MongooseModule.name);

    if (connection.readyState === 1) {
      logger.log(GlobalMessageEnum.DB_CONNECTED);
      mongoose.plugin(require('mongoose-autopopulate'));
    } else {
      logger.error(GlobalMessageEnum.DB_DISCONNECTED);
    }

    connection.on('disconnected', () => {
      logger.error(GlobalMessageEnum.DB_DISCONNECTED);
    });

    return connection;
  },
};
