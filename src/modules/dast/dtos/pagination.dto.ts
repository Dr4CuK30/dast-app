import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationResult<T> {
  results: T[];
  items: number;
  page: number;
}

export class PaginationParams {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  limit: number;
}
