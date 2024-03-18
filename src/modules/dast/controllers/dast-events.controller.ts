import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaTopicsEnum } from '../../../infrastructure/kafka/enums/topics.enum';
import { SpiderService } from 'src/modules/dast/services/spider.service';
import {
  StartActiveScanDto,
  StartSpiderScanDto,
} from '../../../infrastructure/kafka/dtos/kafka.dto';
import { AscanService } from '../services/ascan.service';
import { AjaxSpiderService } from '../services/ajax-spider.service';

@Controller('dast-events')
export class DastEventsController {
  constructor(
    private readonly spiderService: SpiderService,
    private readonly ascanService: AscanService,
    private readonly ajaxScanService: AjaxSpiderService,
  ) {}
  @MessagePattern(KafkaTopicsEnum.SPIDER)
  async startSpiderScan(@Payload() message: StartSpiderScanDto) {
    await this.spiderService.startSpiderScan(
      message.scanTraceId,
      message.maxChildren,
      message.subtreeOnly,
    );
  }
  @MessagePattern(KafkaTopicsEnum.AJAX_SPIDER)
  async startAjaxSpiderScan(@Payload() message: StartSpiderScanDto) {
    await this.ajaxScanService.startAjaxSpiderScan(
      message.scanTraceId,
      message.maxChildren,
      message.subtreeOnly,
    );
  }

  @MessagePattern(KafkaTopicsEnum.ASCAN)
  async startActiveScan(@Payload() message: StartActiveScanDto) {
    await this.ascanService.startActiveScan(message.scanTraceId);
  }
}
