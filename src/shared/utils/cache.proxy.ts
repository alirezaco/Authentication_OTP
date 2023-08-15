import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheKeysEnum } from '../enum/cache-keys.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheProxy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async insertData(
    key: string,
    data: Record<string, any>,
    ttlTime: number = 0,
  ) {
    await this.cacheManager.set(CacheKeysEnum.PREIX_KEYW + key, data, ttlTime);
  }

  async getData(key: string): Promise<any> {
    return this.cacheManager.get(CacheKeysEnum.PREIX_KEYW + key);
  }

  async incrFieldValue(key: string, field: string) {
    let data = await this.getData(key);

    try {
      data[field]++;
    } catch (error) {
      data = {};
      data[field] = 1;
    }

    await this.insertData(key, data);
  }

  async deleteData(key: string) {
    await this.cacheManager.del(CacheKeysEnum.PREIX_KEYW + key);
  }
}
