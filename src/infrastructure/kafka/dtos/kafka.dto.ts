export class StartSpiderScanDto {
  scanTraceId: number;
  maxChildren: number;
  subtreeOnly: boolean;
}

export class StartActiveScanDto {
  scanTraceId: number;
}
