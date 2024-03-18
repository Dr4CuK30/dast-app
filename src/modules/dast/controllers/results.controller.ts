import { Controller, Get, Query } from '@nestjs/common';
import { ResultsService } from '../services/results.service';
import { GetAlertsByScanIdDto, GetUrlsDto } from '../dtos/results.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('alerts')
  getAlerts(@Query() query: GetAlertsByScanIdDto) {
    return this.resultsService.getAlertsByScanId(query);
  }

  @Get('urls')
  getUrls(@Query() query: GetUrlsDto) {
    return this.resultsService.getUrls(query);
  }
}
