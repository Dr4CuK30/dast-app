export class StartSpiderScanDto {
  url: string;
  subtreeOnly?: boolean;
  maxChildren?: number;
}

export class FullResultsResponse {
  fullResults: [
    {
      urlsInScope: ScopeUrl[];
    },
    {
      urlsOutOfScope: string[];
    },
    {
      urlsIoError: any[];
    },
  ];
}

export class FullAjaxResultsResponse {
  fullResults: {
    inScope: ScopeUrl[];
    outOfScope: ScopeUrl[];
    errors: any[];
  };
}

export class GetAjaxSpiderFoundUrlsResponse {
  urlsInScope: AjaxUrlParsedData[];
  urlsOutOfScope: AjaxUrlParsedData[];
  errors: any[];
}

class AjaxUrlParsedData {
  method: string;
  messageId: number;
  url: string;
  statusCode: number;
  statusReason: string;
}

class ScopeUrl {
  processed: string;
  statusReason: string;
  method: string;
  reasonNotProcessed: string;
  messageId: string;
  url: string;
  statusCode: string;
}
class ScopeUrlParsed {
  processed: boolean;
  statusReason: string;
  method: string;
  reasonNotProcessed: string;
  messageId: number;
  url: string;
  statusCode: number;
}

export class GetSpiderFoundUrlsResponse {
  urlsInScope: ScopeUrlParsed[];
  urlsOutOfScope: string[];
}
