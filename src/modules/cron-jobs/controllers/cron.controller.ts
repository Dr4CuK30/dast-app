import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CronService } from '../services/cron.service';
import { AddCronDto, DeleteCronDto } from '../dtos/cron.dto';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}
  @Get()
  getActiveCrons() {
    return this.cronService.getActiveCrons();
  }

  @Post('scan')
  addScanCronJob(@Body() data: AddCronDto) {
    return this.cronService.addCronJob(data);
  }

  @Delete()
  deleteCronJob(@Body() data: DeleteCronDto) {
    return this.cronService.deleteCronJob(data.cronName);
  }
}
