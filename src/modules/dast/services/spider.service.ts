import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScannerService } from 'src/resources/scanner/interfaces/scanner.interface';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { Repository } from 'typeorm';
import { controlValidation } from 'src/utils/control';
import { UrlEntity } from '../entities/url.entity';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { KafkaProducerService } from 'src/infrastructure/kafka/producer/producer.service';
import { UrlScanTypes } from '../enums/url-scan.enum';
import { ScanStatusService } from 'src/infrastructure/cache/services/scan-status.service';

@Injectable()
export class SpiderService {
  private MAX_SCANNER_TIME = +process.env.MAX_SPIDER_TIME_MS;
  private SPIDER_REFRESH_TIME = +process.env.SPIDER_REFRESH_MS;
  constructor(
    private readonly scanStatusService: ScanStatusService,
    private readonly kafkaService: KafkaProducerService,
    @Inject('SCANNER') private readonly scannerService: ScannerService,
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlEntity: Repository<UrlEntity>,
  ) {}

  async startSpiderScan(
    scanTraceId: number,
    maxChildren: number,
    subtreeOnly: boolean,
  ) {
    const trace = await this.scanTraceEntity.findOneBy({ id: scanTraceId });
    trace.spiderId = await this.scannerService.startSpiderScan({
      url: trace.mainUrl,
      maxChildren,
      subtreeOnly,
    });
    trace.status = ScanStatusEnum.SPIDER;
    await this.scanTraceEntity.save(trace);
    this.verifySpiderScan(trace, maxChildren, subtreeOnly);
  }

  private async verifySpiderScan(
    trace: ScanTraceEntity,
    maxChildren: number,
    subtreeOnly: boolean,
  ) {
    const { id: scanTraceId, includeAjaxScan } = trace;
    controlValidation(
      async () => {
        const progress = await this.scannerService.getSpiderScanStatus(
          trace.spiderId.toString(),
        );
        const cache = await this.scanStatusService.getScanStatus(trace.id);
        this.scanStatusService.setScanStatus(trace.id, {
          progress: progress,
          waitingToFinish: cache.waitingToFinish,
        });
        return progress;
      },
      () => {
        this.saveDetectedUrls(trace);
        if (includeAjaxScan) {
          this.kafkaService.sendAjaxSpiderEvent({
            scanTraceId,
            maxChildren,
            subtreeOnly,
          });
        } else {
          this.kafkaService.sendAscanEvent({ scanTraceId: trace.id });
        }
      },
      this.SPIDER_REFRESH_TIME,
      this.MAX_SCANNER_TIME,
    );
  }

  private async saveDetectedUrls(trace: ScanTraceEntity) {
    const urlsData = await this.scannerService.getSpiderFoundUrls(
      trace.spiderId,
    );
    const urlsToSave: Partial<UrlEntity>[] = urlsData.urlsInScope.map(
      (url) => ({
        url: url.url,
        inScope: true,
        method: url.method,
        processed: url.processed,
        type: UrlScanTypes.SPIDER,
        scan: trace,
      }),
    );
    await this.urlEntity.save(urlsToSave);
  }
}
