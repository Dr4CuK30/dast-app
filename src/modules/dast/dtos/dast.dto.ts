import { AlertRiskEnum } from '../enums/alert-risk.enum';

export class AlertScannerResponse {
  alerts: AlertData[];
}

class AlertData {
  sourceid: string;
  other: string;
  method: string;
  evidence: string;
  pluginId: string;
  cweid: string;
  confidence: AlertRiskEnum;
  wascid: string;
  description: string;
  messageId: string;
  inputVector: string;
  url: string;
  tags: AlertTags;
  reference: string;
  solution: string;
  alert: string;
  param: string;
  attack: string;
  name: string;
  risk: AlertRiskEnum;
  id: string;
  alertRef: string;
}

export class AlertResponse {
  sourceId: number;
  other: string;
  method: string;
  evidence: string;
  pluginId: number;
  cweId: number;
  confidence: AlertRiskEnum;
  wascId: number;
  description: string;
  messageId: number;
  inputVector: string;
  url: string;
  tags: AlertTags;
  reference: string;
  solution: string;
  alert: string;
  param: string;
  attack: string;
  name: string;
  risk: AlertRiskEnum;
  id: number;
  alertRef: string;
}

export class AlertTags {
  [tag: string]: string;
}
