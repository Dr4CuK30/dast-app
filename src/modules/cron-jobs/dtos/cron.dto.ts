import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddCronDto {
  @IsString()
  cronName: string;

  @IsOptional()
  @IsString()
  cronPattern: string;

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

export class DeleteCronDto {
  @IsString()
  cronName: string;
}
