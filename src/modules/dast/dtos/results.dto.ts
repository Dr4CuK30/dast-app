import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AlertRiskEnum } from '../enums/alert-risk.enum';
import { Transform } from 'class-transformer';
import { UrlScanTypes } from '../enums/url-scan.enum';
import { PaginationParams } from './pagination.dto';

export class GetAlertsByScanIdDto extends PaginationParams {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  scanId?: number;

  @IsOptional()
  @IsEnum(AlertRiskEnum)
  risk?: AlertRiskEnum;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.replaceAll(' ', '').split(',') : value,
  )
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  alertRef: string;
}

export class GetUrlsDto extends PaginationParams {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  scanId?: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsEnum(UrlScanTypes)
  foundOn?: UrlScanTypes;
}
