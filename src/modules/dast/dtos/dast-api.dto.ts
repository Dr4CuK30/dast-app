import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScanStatusEnum } from '../enums/scan-status.enum';
import { Transform } from 'class-transformer';

export class StartCompleteScanDto {
  @IsArray()
  urls: string[];

  @IsOptional()
  @IsBoolean()
  subtreeOnly?: boolean;

  @IsOptional()
  @IsNumber()
  maxChildren?: number;

  @IsOptional()
  @IsBoolean()
  includeAjaxScan?: boolean;
}

export class StartCompleteScanResponse {
  scans: ScanDataResponse[];
}

export class ScanDataResponse {
  scanTraceId: number;
  url: string;
}

export class GetAllScansInfoDto {
  @IsOptional()
  @IsEnum(ScanStatusEnum)
  status?: ScanStatusEnum;

  @IsOptional()
  @IsString()
  mainUrl?: string;
}

export class GetScanInfoDto {
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  includeUrls: boolean;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  includeAlerts: boolean;
}
