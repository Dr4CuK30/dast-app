import { Module } from '@nestjs/common';
import { CronController } from './controllers/cron.controller';
import { CronService } from './services/cron.service';
import { DastModule } from '../dast/dast.module';

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [DastModule],
})
export class CronJobsModule {}
