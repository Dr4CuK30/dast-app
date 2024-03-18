import { Injectable } from '@nestjs/common';
import { ScannerService } from '../interfaces/scanner.interface';
import * as ZapClient from 'zaproxy';
import {
  FullAjaxResultsResponse,
  FullResultsResponse,
  GetAjaxSpiderFoundUrlsResponse,
  GetSpiderFoundUrlsResponse,
  StartSpiderScanDto,
} from '../dtos/scanner.dto';
import {
  AlertResponse,
  AlertScannerResponse,
} from 'src/modules/dast/dtos/dast.dto';
import { parseZaproxyAlertsResponse } from 'src/utils/parser';
import { AjaxSpiderScanStatus } from '../enums/ajax-spider.enum';

@Injectable()
export class ScannerImplementation implements ScannerService {
  private zaproxy: ZapClient;
  public machineId: string;
  constructor() {
    this.machineId = `${process.env.ZAPROXY_HOST}:${process.env.ZAPROXY_PORT}`;
    this.zaproxy = new ZapClient({
      apiKey: process.env.ZAPROXY_APIKEY,
      proxy: {
        host: process.env.ZAPROXY_HOST,
        port: process.env.ZAPROXY_PORT,
      },
    });
  }

  // SPIDER SERVICES
  async startSpiderScan({
    url,
    maxChildren = 10,
    subtreeOnly = false,
  }: StartSpiderScanDto): Promise<number> {
    const response: { scan: string } = await this.zaproxy.spider.scan({
      url,
      maxChildren,
      subtreeOnly,
    });
    return +response.scan;
  }

  async getSpiderScanStatus(scanId: string): Promise<number> {
    const response: { status: string } = await this.zaproxy.spider.status({
      scanId,
    });
    return +response.status;
  }

  async getSpiderFoundUrls(
    scanid: number,
  ): Promise<GetSpiderFoundUrlsResponse> {
    const response: FullResultsResponse = await this.zaproxy.spider.fullResults(
      {
        scanid,
      },
    );
    return {
      urlsInScope: response.fullResults[0].urlsInScope.map((url) => ({
        url: url.url,
        statusReason: url.statusReason,
        messageId: +url.messageId,
        method: url.method,
        processed: Boolean(url.processed),
        statusCode: +url.statusCode,
        reasonNotProcessed: url.reasonNotProcessed,
      })),
      urlsOutOfScope: response.fullResults[1].urlsOutOfScope,
    };
  }

  // ACTIVE SCAN SERVICES
  async startActiveScan(url: string): Promise<number> {
    const response: { scan: string } = await this.zaproxy.ascan.scan({
      url,
    });
    return +response.scan;
  }

  async getActiveScanStatus(scanId: number): Promise<number> {
    const response: { status: string } = await this.zaproxy.ascan.status({
      scanId,
    });
    return +response.status;
  }

  async getAlertsResult(url: string): Promise<AlertResponse[]> {
    const response: AlertScannerResponse = await this.zaproxy.alert.alerts({
      baseurl: url,
    });
    return parseZaproxyAlertsResponse(response);
  }

  // AJAX SPIDER SERVICES
  async startAjaxSpiderScan({
    url,
    maxChildren,
    subtreeOnly,
  }: StartSpiderScanDto): Promise<void> {
    await this.zaproxy.ajaxSpider.scan({
      url,
      maxChildren,
      subtreeOnly,
    });
  }
  async getAjaxSpiderScanStatus(): Promise<AjaxSpiderScanStatus> {
    const response: { status: AjaxSpiderScanStatus } =
      await this.zaproxy.ajaxSpider.status();
    return response.status;
  }
  async getAjaxSpiderFoundUrls(): Promise<GetAjaxSpiderFoundUrlsResponse> {
    const { fullResults }: FullAjaxResultsResponse =
      await this.zaproxy.ajaxSpider.fullResults();
    const response: GetAjaxSpiderFoundUrlsResponse = {
      urlsInScope: fullResults.inScope.map((url) => ({
        url: url.url,
        messageId: +url.messageId,
        method: url.method,
        statusCode: +url.statusCode,
        statusReason: url.statusReason,
      })),
      urlsOutOfScope: fullResults.outOfScope.map((url) => ({
        url: url.url,
        messageId: +url.messageId,
        method: url.method,
        statusCode: +url.statusCode,
        statusReason: url.statusReason,
      })),
      errors: fullResults.errors,
    };
    return response;
  }
}
