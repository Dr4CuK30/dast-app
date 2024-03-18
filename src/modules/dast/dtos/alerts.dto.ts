import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AlertRiskEnum } from '../enums/alert-risk.enum';
import { Transform } from 'class-transformer';

export class GetAlertsByScanIdDto {
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
