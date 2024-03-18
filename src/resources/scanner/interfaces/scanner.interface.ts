import { AlertResponse } from 'src/modules/dast/dtos/dast.dto';
import {
  GetAjaxSpiderFoundUrlsResponse,
  GetSpiderFoundUrlsResponse,
  StartSpiderScanDto,
} from '../dtos/scanner.dto';
import { AjaxSpiderScanStatus } from '../enums/ajax-spider.enum';

export interface ScannerService {
  machineId: string;
  startSpiderScan(data: StartSpiderScanDto): Promise<number>;
  getSpiderScanStatus(scanId: string): Promise<number>;
  getSpiderFoundUrls(scanId: number): Promise<GetSpiderFoundUrlsResponse>;
  startAjaxSpiderScan(data: StartSpiderScanDto): Promise<void>;
  getAjaxSpiderScanStatus(): Promise<AjaxSpiderScanStatus>;
  getAjaxSpiderFoundUrls(): Promise<GetAjaxSpiderFoundUrlsResponse>;
  startActiveScan(url: string): Promise<number>;
  getActiveScanStatus(scanId: number): Promise<number>;
  getAlertsResult(url: string): Promise<AlertResponse[]>;
}
