import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisKeyPrefixEnum } from '../enums/redis.enum';

@Injectable()
export class WaitlistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFirstOnWaitlist(machineId: string): Promise<string> {
    const waitlist = await this.getWaitlist(machineId);
    return waitlist[0];
  }

  async addToWaitingList(machineId: string, turnId: string): Promise<void> {
    const turns = await this.getWaitlist(machineId);
    turns.push(turnId);
    await this.setWaitlist(machineId, turns);
  }

  async serveFirstOnWaitlist(machineId: string) {
    const turns = await this.cacheManager.get<string[]>(
      `${RedisKeyPrefixEnum.MELI_DAST_AJAX_WAITLIST}:${machineId}`,
    );
    turns.shift();
    await this.setWaitlist(machineId, turns);
  }

  private async setWaitlist(machineId: string, turns: string[]): Promise<void> {
    await this.cacheManager.set(
      `${RedisKeyPrefixEnum.MELI_DAST_AJAX_WAITLIST}:${machineId}`,
      turns,
    );
  }

  private async getWaitlist(machineId: string): Promise<string[]> {
    const waitlist = await this.cacheManager.get<string[]>(
      `${RedisKeyPrefixEnum.MELI_DAST_AJAX_WAITLIST}:${machineId}`,
    );
    return waitlist || [];
  }
}
