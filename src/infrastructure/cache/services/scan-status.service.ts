import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisKeyPrefixEnum } from '../enums/redis.enum';
import { ScanStatus } from '../dtos/scan-status.dto';

@Injectable()
export class ScanStatusService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getScanStatus(scanId: number): Promise<ScanStatus> {
    return this.cacheManager.get<ScanStatus>(
      `${RedisKeyPrefixEnum.MELI_DAST_SCAN_INFO}:${scanId}`,
    );
  }

  async setScanStatus(scanId: number, data: ScanStatus) {
    return this.cacheManager.set(
      `${RedisKeyPrefixEnum.MELI_DAST_SCAN_INFO}:${scanId}`,
      data,
    );
  }
}
