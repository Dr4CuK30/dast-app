import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScannerService } from 'src/resources/scanner/interfaces/scanner.interface';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/control';
import { UrlEntity } from '../entities/url.entity';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { KafkaProducerService } from 'src/infrastructure/kafka/producer/producer.service';
import { UrlScanTypes } from '../enums/url-scan.enum';
import { AjaxSpiderScanStatus } from 'src/resources/scanner/enums/ajax-spider.enum';
import { ScanStatusService } from 'src/infrastructure/cache/services/scan-status.service';
import { v4 } from 'uuid';
import { WaitlistService } from 'src/infrastructure/cache/services/waitlist.service';

@Injectable()
export class AjaxSpiderService {
  private MAX_SCANNER_TIME = +process.env.MAX_AJAX_SPIDER_TIME_MS;
  private REFRESH_TIME = +process.env.AJAX_SPIDER_REFRESH_MS;
  constructor(
    private readonly scanStatusService: ScanStatusService,
    private readonly waitlistService: WaitlistService,
    private readonly kafkaService: KafkaProducerService,
    @Inject('SCANNER') private readonly scannerService: ScannerService,
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlEntity: Repository<UrlEntity>,
  ) {}

  async startAjaxSpiderScan(
    scanTraceId: number,
    maxChildren: number,
    subtreeOnly: boolean,
  ) {
    const trace = await this.scanTraceEntity.findOneBy({ id: scanTraceId });
    const machineId = this.scannerService.machineId;
    let actualTurn: string;
    const turnId = v4();
    await this.waitlistService.addToWaitingList(machineId, turnId);
    while (turnId !== actualTurn) {
      actualTurn = await this.waitlistService.getFirstOnWaitlist(machineId);
      await delay(1000);
    }
    await this.scannerService.startAjaxSpiderScan({
      url: trace.mainUrl,
      maxChildren,
      subtreeOnly,
    });
    trace.status = ScanStatusEnum.AJAX_SPIDER;
    await this.scanTraceEntity.save(trace);
    this.verifyAjaxSpiderScan(scanTraceId);
  }

  private async verifyAjaxSpiderScan(scanTraceId: number) {
    let actualProgress: AjaxSpiderScanStatus;
    let elapsedTime = 0;
    while (
      actualProgress !== AjaxSpiderScanStatus.STOPPED ||
      (this.MAX_SCANNER_TIME && actualProgress !== AjaxSpiderScanStatus.STOPPED
        ? elapsedTime < this.MAX_SCANNER_TIME
        : false)
    ) {
      actualProgress = await this.scannerService.getAjaxSpiderScanStatus();
      await delay(this.REFRESH_TIME);
      elapsedTime += this.REFRESH_TIME;
      console.log(actualProgress);
    }
    this.saveDetectedUrls(scanTraceId);
    this.kafkaService.sendAscanEvent({ scanTraceId });
  }

  private async saveDetectedUrls(scanTraceId: number) {
    const scan = await this.scanTraceEntity.findOneBy({ id: scanTraceId });
    const urlsData = await this.scannerService.getAjaxSpiderFoundUrls();
    this.waitlistService.serveFirstOnWaitlist(this.scannerService.machineId);
    const urlsToSave: Partial<UrlEntity>[] = urlsData.urlsInScope.map(
      (url) => ({
        url: url.url,
        inScope: true,
        method: url.method,
        processed: true,
        type: UrlScanTypes.AJAX_SPIDER,
        scan,
      }),
    );
    await this.urlEntity.save(urlsToSave);
  }
}
