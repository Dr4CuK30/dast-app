import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScannerService } from 'src/resources/scanner/interfaces/scanner.interface';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { controlValidation } from 'src/utils/control';
import { TagsEntity } from '../entities/tags.entity';
import { AlertEntity } from '../entities/alert.entity';

@Injectable()
export class AscanService {
  private MAX_SCANNER_TIME = +process.env.MAX_ACTIVE_SCAN_TIME_MS;
  private SPIDER_REFRESH_TIME = +process.env.ACTIVE_SCAN_REFRESH_MS;
  constructor(
    @Inject('SCANNER') private readonly scannerService: ScannerService,
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
    @InjectRepository(AlertEntity)
    private readonly alertEntity: Repository<AlertEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsEntity: Repository<TagsEntity>,
  ) {}
  async startActiveScan(scanTraceId: number) {
    let trace = await this.scanTraceEntity.findOneBy({
      id: scanTraceId,
    });
    trace.ascanId = await this.scannerService.startActiveScan(trace.mainUrl);
    trace.status = ScanStatusEnum.ACTIVE_SCAN;
    trace = await this.scanTraceEntity.save(trace);
    this.verifyActiveScan(trace, trace.ascanId);
  }
  private async verifyActiveScan(trace: ScanTraceEntity, ascanId: number) {
    controlValidation(
      () => this.scannerService.getActiveScanStatus(ascanId),
      () => {
        this.saveActiveScanResults(trace);
      },
      this.SPIDER_REFRESH_TIME,
      this.MAX_SCANNER_TIME,
    );
  }

  private async saveActiveScanResults(trace: ScanTraceEntity) {
    trace = await this.scanTraceEntity.save(trace);
    const alerts = await this.scannerService.getAlertsResult(trace.mainUrl);
    for (const alert of alerts) {
      const { tags, ...alertData } = alert;
      let tagsToSave: Partial<TagsEntity>[] = Object.entries(tags).map(
        ([key, value]) => ({
          name: key,
          source: value,
        }),
      );
      tagsToSave = await this.tagsEntity.save(tagsToSave);
      await this.alertEntity.save({
        ...alertData,
        scan: trace,
        tags: tagsToSave,
      });
    }
    trace.status = ScanStatusEnum.FINISHED;
    await this.scanTraceEntity.save(trace);
  }
}
