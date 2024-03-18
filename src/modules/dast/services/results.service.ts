import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { AlertEntity } from '../entities/alert.entity';
import { GetAlertsByScanIdDto, GetUrlsDto } from '../dtos/results.dto';
import { ScanTraceEntity } from '../entities/scan-trace.entity';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { UrlEntity } from '../entities/url.entity';
import { PaginationResult } from '../dtos/pagination.dto';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(ScanTraceEntity)
    private readonly scanTraceEntity: Repository<ScanTraceEntity>,
    @InjectRepository(AlertEntity)
    private readonly alertEntity: Repository<AlertEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlEntity: Repository<UrlEntity>,
  ) {}

  async getAlertsByScanId({
    scanId: id,
    risk,
    tags,
    alertRef,
    limit = 10,
    page = 1,
  }: GetAlertsByScanIdDto): Promise<PaginationResult<Partial<AlertEntity>>> {
    let scan;
    const skip = (page - 1) * limit;
    if (id) {
      scan = await this.scanTraceEntity.findOneBy({ id });
      if (scan.status !== ScanStatusEnum.FINISHED) {
        throw new BadRequestException('scan not finished');
      }
    }
    const results = await this.alertEntity.find({
      where: {
        scan: { id },
        risk,
        tags: tags?.length ? { name: In(tags) } : null,
        alertRef,
      },
      relations: { tags: true },
      take: limit,
      skip,
    });
    return { results, items: results.length, page };
  }

  async getUrls({
    foundOn,
    method,
    scanId: id,
    url,
    page = 1,
    limit = 10,
  }: GetUrlsDto): Promise<PaginationResult<Partial<UrlEntity>>> {
    let scan;
    const skip = (page - 1) * limit;
    if (id) {
      scan = await this.scanTraceEntity.findOneBy({ id });
      if (
        scan.status === ScanStatusEnum.STARTED ||
        scan.status === ScanStatusEnum.FAILED
      ) {
        throw new BadRequestException('url scan not finished');
      }
    }
    const results = await this.urlEntity.find({
      where: {
        scan: { id },
        method,
        type: foundOn,
        url: url ? Like(url) : null,
      },
      skip,
      take: limit,
    });
    return {
      results,
      items: results.length,
      page,
    };
  }
}
