import { Injectable } from '@nestjs/common';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  GetAllScansInfoDto,
  GetScanInfoDto,
  ScanDataResponse,
  StartCompleteScanDto,
  StartCompleteScanResponse,
} from '../dtos/dast-api.dto';
import { KafkaProducerService } from 'src/infrastructure/kafka/producer/producer.service';

@Injectable()
export class DastService {
  constructor(
    private readonly kafkaService: KafkaProducerService,
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
  ) {}
  async startCompleteScan({
    urls,
    maxChildren,
    subtreeOnly,
    includeAjaxScan,
  }: StartCompleteScanDto): Promise<StartCompleteScanResponse> {
    const scans: ScanDataResponse[] = [];
    for (const url of urls) {
      const trace = await this.scanTraceEntity.save({
        includeAjaxScan,
        mainUrl: url,
        status: ScanStatusEnum.STARTED,
      });
      this.kafkaService.sendSpiderEvent({
        maxChildren,
        subtreeOnly,
        scanTraceId: trace.id,
      });
      scans.push({ url, scanTraceId: trace.id });
    }
    return { scans };
  }

  getAllScansInfo(filters: GetAllScansInfoDto) {
    return this.scanTraceEntity.find({ where: filters });
  }

  getScanCompleteInfo(id: number) {
    return this.scanTraceEntity.findOne({
      where: { id },
      relations: { alerts: { tags: true }, urls: true },
    });
  }

  getScanInfoById(
    id: number,
    { includeAlerts = true, includeUrls = true }: GetScanInfoDto,
  ) {
    const relations: FindOptionsRelations<ScanTraceEntity> = {};
    relations.urls = includeUrls;
    relations.alerts = includeAlerts ? { tags: true } : false;
    return this.scanTraceEntity.findOne({
      where: { id },
      relations,
    });
  }
}
