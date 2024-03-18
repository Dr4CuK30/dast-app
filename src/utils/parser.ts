import {
  AlertResponse,
  AlertScannerResponse,
} from 'src/modules/dast/dtos/dast.dto';

export function parseZaproxyAlertsResponse(
  alerts: AlertScannerResponse,
): AlertResponse[] {
  return alerts.alerts.map((alert) => {
    const parsedAlert: AlertResponse = {
      ...alert,
      cweId: +alert.cweid,
      id: +alert.id,
      messageId: +alert.messageId,
      pluginId: +alert.pluginId,
      sourceId: +alert.sourceid,
      wascId: +alert.wascid,
    };
    return parsedAlert;
  });
}
