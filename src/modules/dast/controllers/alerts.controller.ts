import { Controller, Get, Query } from '@nestjs/common';
import { AlertsService } from '../services/alerts.service';
import { GetAlertsByScanIdDto } from '../dtos/alerts.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  getAlerts(@Query() query: GetAlertsByScanIdDto) {
    return this.alertsService.getAlertsByScanId(query);
  }
}
