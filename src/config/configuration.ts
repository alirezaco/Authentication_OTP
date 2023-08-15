import { join } from 'path';
import { EnvEnum } from 'src/shared/enum/env.enum';
import { load } from 'ts-dotenv';

const FileConfigPath = () => {
  return join(__dirname, '../../config', `.env.${process.env.NODE_ENV}`);
};

const env = load(
  {
    //app  config
    PORT: {
      type: Number,
      default: 3000,
    },
    NODE_ENV: {
      type: [EnvEnum.PRODUCTION as const, EnvEnum.DEVELOPMENT as const],
      default: EnvEnum.DEVELOPMENT,
    },

    //mongo config
    MONGO_URL: {
      type: String,
      default: 'mongodb://127.0.0.1:27017/ariaco',
    },

    //redis config (disable)
    REDIS_HOST: {
      type: String,
      default: '127.0.0.1',
    },
    REDIS_PORT: {
      type: Number,
      default: 6379,
    },

    //requests limit config
    LIMIT_RATE: {
      type: Number,
      default: 50,
    },
    TTL_RATE: {
      type: Number,
      default: 60,
    },

    //jwt config
    SECRET_KEY: {
      type: String,
      default: 'aria158937TKFDOCLPWL<CO',
    },
    TOKEN_EXPIRE_TIME: {
      type: Number,
      default: 30,
    },

    //kavenegar config
    KAVENEGAR_KEY: {
      type: String,
      default:
        '736D2B556870776A564E7A2F7638784E304C7867433259472B5845324B38574F485159642B5643576B34513D',
    },

    //super admin config
    SUPER_ADMIN_USERNAME: {
      type: String,
      default: 'superAdmin',
    },
    SUPER_ADMIN_PASSWORD: {
      type: String,
      default: 'admin1234',
    },
    SUPER_ADMIN_EMAIL: {
      type: String,
      default: 'ali.mahmodi500544@gmail.com',
    },
    SUPER_ADMIN_PHONE: {
      type: String,
      default: '09216917497',
    },
  },
  {
    path: FileConfigPath(),
  },
);

export default () => ({
  app: {
    port: env.PORT,
    limitRate: env.LIMIT_RATE,
    ttlRate: env.TTL_RATE,
    env: env.NODE_ENV,
  },

  mongodb: {
    url: env.MONGO_URL,
  },

  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },

  jwt: {
    secretKey: env.SECRET_KEY,
    expire: env.TOKEN_EXPIRE_TIME * 60 * 60,
  },

  kavenegar: {
    key: env.KAVENEGAR_KEY,
  },

  superAdmin: {
    username: env.SUPER_ADMIN_USERNAME,
    password: env.SUPER_ADMIN_PASSWORD,
    email: env.SUPER_ADMIN_EMAIL,
    phone: env.SUPER_ADMIN_PHONE,
  },
});
