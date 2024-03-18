import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  GetAllScansInfoDto,
  GetScanInfoDto,
  StartCompleteScanDto,
} from '../dtos/dast-api.dto';
import { DastService } from '../services/dast.service';

@Controller('dast')
export class DastController {
  constructor(private readonly dastService: DastService) {}
  @Post('start')
  startCompleteScan(@Body() data: StartCompleteScanDto) {
    return this.dastService.startCompleteScan(data);
  }

  @Get('all-scans')
  getAllScans(@Query() query: GetAllScansInfoDto) {
    return this.dastService.getAllScansInfo(query);
  }

  @Get('scan/:id')
  getScanInfoById(@Param('id') id: number, @Query() query: GetScanInfoDto) {
    return this.dastService.getScanInfoById(id, query);
  }
}
