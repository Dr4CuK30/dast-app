import { Module } from '@nestjs/common';
import {
  CacheStore,
  CacheModule as ExternalCacheModule,
} from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { ScanStatusService } from './services/scan-status.service';
import { WaitlistService } from './services/waitlist.service';

@Module({
  imports: [
    ExternalCacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
          },
        });
        return { store: store as unknown as CacheStore };
      },
    }),
  ],
  providers: [ScanStatusService, WaitlistService],
  exports: [ScanStatusService, WaitlistService],
})
export class CacheModule {}
