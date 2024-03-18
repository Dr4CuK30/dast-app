import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlertEntity } from '../entities/alert.entity';
import { GetAlertsByScanIdDto } from '../dtos/alerts.dto';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { ScanStatusEnum } from '../enums/scan-status.enum';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
    @InjectRepository(AlertEntity)
    private readonly alertEntity: Repository<AlertEntity>,
  ) {}

  async getAlertsByScanId({
    scanId: id,
    risk,
    tags,
    alertRef,
  }: GetAlertsByScanIdDto) {
    let scan;
    if (id) {
      scan = await this.scanTraceEntity.findOneBy({ id });
      if (scan.status !== ScanStatusEnum.FINISHED) {
        throw new BadRequestException('scan not finished');
      }
    }
    return this.alertEntity.find({
      where: {
        scan: { id },
        risk,
        tags: tags?.length ? { name: In(tags) } : null,
        alertRef,
      },
      relations: { tags: true },
    });
  }
}
