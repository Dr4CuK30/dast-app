import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AddCronDto } from '../dtos/cron.dto';
import { DastService } from 'src/modules/dast/services/dast.service';

@Injectable()
export class CronService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly dastService: DastService,
  ) {}

  getActiveCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    return Object.keys(Object.fromEntries(jobs));
  }

  addCronJob({
    cronName,
    urls,
    includeAjaxScan,
    maxChildren,
    subtreeOnly,
    cronPattern = '* * * * * *',
  }: AddCronDto) {
    try {
      const job = new CronJob(cronPattern, () => {
        this.dastService.startCompleteScan({
          urls,
          includeAjaxScan,
          maxChildren,
          subtreeOnly,
        });
      });
      this.schedulerRegistry.addCronJob(cronName, job);
      job.start();
      return { message: 'OK' };
    } catch (error) {
      throw new BadRequestException('CronName already created');
    }
  }

  deleteCronJob(cronName: string) {
    this.schedulerRegistry.deleteCronJob(cronName);
    return { message: 'OK' };
  }
}
