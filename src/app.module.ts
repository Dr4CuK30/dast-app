import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DastModule } from './modules/dast/dast.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { ScannerModule } from './resources/scanner/scanner.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CronJobsModule } from './modules/cron-jobs/cron-jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from './infrastructure/cache/cache.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    DastModule,
    KafkaModule,
    ScannerModule,
    DatabaseModule,
    CronJobsModule,
    CacheModule,
  ],
})
export class AppModule {}
